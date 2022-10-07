'use strict';

const fs = require('fs')
const path = require('path')
const {Module} = require('./lib/mod')
const PipePair = require('./lib/pipe')
const PDK = require('./pdk')

const entities = ['Service', 'Consumer', 'Route', 'Plugin', 'Credential', 'MemoryStats']
const MSG_RET = 'ret'
const ERROR_NAME = 'PluginServerError'
const VALID_EXTENSIONS = new Set([
  '.js',
  '.ts',
  '.node',
  '.cjs',
  ''
])

class PluginServerError extends Error {
  get name () {
    return ERROR_NAME
  }

  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, this.constructor)
  }
}

class Server {
  get Error() {
    return PluginServerError
  }

  static get Error() {
    return PluginServerError
  }

  constructor(pluginDir, logger, expireTtl) {
    this.pluginDir = pluginDir
    this.logger = logger
    this.plugins = new Map()
    this.instances = new Map()
    this.instanceID = 0
    this.events = new Map()
    this.eventID = 0

    if (pluginDir) {
      this.loadPlugins()
    }

    this.clearExpiredPluginsTimer = this.clearExpiredPlugins(expireTtl || 60)
  }

  loadPlugins() {
    if (!this.pluginDir) {
      throw new PluginServerError('plugin server is not initialized, call SetPluginDir first')
    }

    const files = fs.readdirSync(this.pluginDir)
    for (const file of files) {

      if (file.startsWith('.')) continue
      if (/node_modules/.test(file)) continue
      const file_path = require.resolve(path.join(this.pluginDir, file))
      const {name, ext} = path.parse(file_path)

      if (!name) continue
      if (!VALID_EXTENSIONS.has(ext)) continue

      const plugin = this.plugins.get(name)
      if (plugin) {
        this.logger.warn(
          `plugin "${name}" is already loaded from ${plugin.path}, ` +
          `trying to load from ${file_path}`
        )
        continue
      }

      try {
        const mod = new Module(name, file_path)
        this.plugins.set(mod.name, mod)
        this.logger.debug(`loaded plugin "${mod.name}" from ${file_path}`)
      } catch (ex) {
        this.logger.warn(`error loading plugin "${name}" from ${file_path}: ${ex.stack}`)
      }
    };
  }

  clearExpiredPlugins(ttl) {
    return setInterval(() => {
      for (const [id, instance] of this.instances.entries()) {
        if (instance.isExpired()) {
          this.logger.debug(`cleanup instance #iid of ${instance.name}`)
          this.instances.delete(id)
        }
      }
    }, ttl)
  }

  close() {
    clearInterval(this.clearExpiredPluginsTimer)
  }

  async SetPluginDir(dir) {
    try {
      await fs.promises.stat(dir)
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      throw new PluginServerError(`${dir} does not exists`)
    }

    this.pluginDir = dir
    this.loadPlugins()
    return 'ok'
  }

  // RPC method
  async GetStatus() {
    const pluginStatus = Object.create(null)
    for (const [name, plugin] of this.plugins.entries()) {
      const instances = []
      for (const iid in this.instances) {
        instances.push(await this.InstanceStatus(iid))
      }

      pluginStatus[name] = {
        Name: name,
        Modtime: plugin.getMTime(),
        LoadTime: plugin.getLoadTime(),
        Instances: instances,
        LastStartInstance: plugin.getLastStartInstanceTime(),
        LastCloseInstance: plugin.getLastCloseInstanceTime(),
      }
    }

    return {
      Pid: process.pid,
      Plugins: pluginStatus
    }
  }

  // RPC method
  async GetPluginInfo(name) {
    const plugin = this.plugins.get(name)
    if (!name || !plugin) {
      throw new PluginServerError(`${name} not initizlied`)
    }

    return {
      Name: name,
      Version: plugin.getVersion(),
      Phases: plugin.getPhases(),
      Priority: plugin.getPriority(),
      Schema: {
        name: name,
        fields: [{
          config: {
            type: 'record',
            fields: plugin.getSchema(),
          }
        }],
      },
    }
  }

  // RPC method
  async StartInstance(cfg) {
    const name = cfg.Name
    const plugin = this.plugins.get(name)
    if (!plugin) {
      throw new PluginServerError(`${name} not initizlied`)
    }

    const config = JSON.parse(cfg.Config)
    const iid = this.instanceID++
    this.instances.set(iid, plugin.new(config))

    this.logger.info(`instance #${iid} of ${name} started`)

    return {
      Name: name,
      Id: iid,
      Config: config,
      StartTime: Date.now() / 1000,
    }
  }

  // RPC method
  async InstanceStatus(iid) {
    const ins = this.instances.get(iid)
    if (!ins) {
      // Note: Kong expect the error to start with "no plugin instance"
      throw new PluginServerError(`no plugin instance #${iid}`)
    }

    return {
      Name: ins.getName(),
      Id: iid,
      Config: ins.getConfig(),
      StartTime: ins.getStartTime(),
    }
  }

  // RPC method
  async CloseInstance(iid) {

    let ins = this.instances.get(iid)
    if (!ins) {
      // Note: Kong expect the error to start with "no plugin instance"
      throw new PluginServerError(`no plugin instance #${iid}`)
    }

    ins.close()
    this.instances.delete(iid)

    return {
      Name: ins.getName(),
      Id: iid,
      Config: ins.getConfig(),
    }
  }

  // RPC method
  async HandleEvent(event) {
    const iid = event.InstanceId
    const ins = this.instances.get(iid)
    if (!ins) {
      // Note: Kong expect the error to start with "no plugin instance"
      throw new PluginServerError(`no plugin instance #${iid}`)
    }

    ins.resetExpireTs()

    const phase = event.EventName
    const eid = this.eventID++

    const [ch, childCh] = new PipePair().getPair()
    this.events.set(eid, ch)

    // https://snyk.io/blog/nodejs-how-even-quick-async-functions-can-block-the-event-loop-starve-io/
    setImmediate(async () => {
      try {
        await ins.executePhase(phase, new PDK(childCh).kong)
      } catch(ex){
        this.logger.warn(
          `unhandled exception in ${ins.name}.${phase} on instance #${iid}: ${ex}`
        )
      }
      childCh.put(MSG_RET)
    })

    const r = await ch.get()
    ins.resetExpireTs()

    return {
      Data: r,
      EventId: eid,
    }
  }

  async step(data, isError) {
    const din = data.Data
    const eid = data.EventId
    const ch = this.events.get(eid)

    if (!ch) {
      throw new PluginServerError(`event id ${eid} not found`)
    }

    if (isError) {
      await ch.put([ undefined, din ])
    } else {
      await ch.put([ din, undefined ])
    }

    const ret = await ch.get()
    if (ret === MSG_RET) this.events.delete(eid)
    return {
      Data: ret,
      EventId: eid
    }
  }

  // RPC method
  async Step(data) {
    return this.step(data, false)
  }

  // RPC method
  async StepError(err) {
    return this.step(err, true)
  }

  // RPC method
  async StepMultiMap(data) {
    return this.step(data, false)
  }

  getLogger() {
    return this.logger
  }

  getPlugins() {
    return this.plugins
  }
}

// Generate other RPC methods
for (const entity of entities) {
  Server.prototype['Step' + entity] = Server.prototype.Step
}


module.exports = Server
