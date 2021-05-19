'use strict';

const fs = require('fs')
const path = require('path')
const process = require('process');
const {
  Module
} = require(path.join(__dirname, 'lib', 'mod'))

const PipePair = require(path.join(__dirname, 'lib', 'pipe'))
const PDK = require(path.join(__dirname, 'pdk'))

const entities = ('Service', 'Consumer', 'Route', 'Plugin', 'Credential', 'MemoryStats')
const MSG_RET = 'ret'

class PluginServerError extends Error {
  constructor(message) {
    super(message)
    this.name = "PluginServerError"
  }
}

class Server {
  constructor(pluginDir, logger, expireTtl) {
    this.pluginDir = pluginDir
    this.logger = logger
    this.plugins = {}
    this.instances = {}
    this.instanceID = 0
    this.events = {}
    this.eventID = 0

    if (pluginDir !== undefined) {
      this.loadPlugins()
    }

    this.clearExpiredPluginsTimer = this.clearExpiredPlugins(expireTtl || 60)
  }

  loadPlugins() {
    if (this.pluginDir === undefined) {
      throw new PluginServerError("plugin server is not initialized, call SetPluginDir first")
    }

    fs.readdirSync(this.pluginDir).forEach(file => {
      let p = path.join(this.pluginDir, file)
      if (fs.statSync(p).isDirectory()) {
        return
      }
      let f = /(.+)\.([^.]+)$/.exec(file)
      let name = f && f[1]
      let ext = f && f[2]
      if (!f || name === undefined || (ext !== 'js' && ext != 'ts') || name.endsWith(".test")) {
        return
      }

      if (this.plugins[name]) {
        this.logger.warn("plugin \"" + name + "\" is already imported from " + this.plugins[name].path +
                    ", trying to reimport from " + p)
        return
      }

      try {
        let m = new Module(name, p)
        this.logger.debug("loaded plugin \"" + name + "\" from " + p)
        this.plugins[name] = m
      } catch (ex) {
        this.logger.warn("error loading plugin \"" + name + "\" from " + p + ": " + ex.stack)
      }
    });
  }

  clearExpiredPlugins(ttl) {
    return setInterval(() => {
      for (let iid in this.instances) {
        let ins = this.instances[iid]
        if (ins.isExpired()) {
          this.logger.debug("cleanup instance #" + iid + " of " + ins.getName())
          delete this.instances[iid]
        }
      }
    }, ttl)
  }
  
  close() {
    clearInterval(this.clearExpiredPluginsTimer)
  }

  async SetPluginDir(dir) {
    if (fs.existsSync(dir) === false) {
      return Promise.reject(new PluginServerError(dir + "not exists"))
    }
    this.pluginDir = dir
    this.loadPlugins()
    return "ok"
  }

  // RPC method
  async GetStatus() {
    let pluginStatus = {}
    for (let name in this.plugins) {
      let instances = []
      for (let iid in this.instances) {
        let [i, err] = this.instanceStatus(iid)
        if (err !== undefined) {
          throw new PluginServerError(err)
        }
        instances.push(i)
      }

      let plugin = this.plugins[name]
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
    if (this.plugins[name] === undefined) {
      return Promise.reject(new PluginServerError(name + " not initizlied"))
    }

    let plugin = this.plugins[name]

    return {
      Name: name,
      Phases: plugin.getPhases(),
      Priority: plugin.getPriority(),
      Schema: {
        name: name,
        fields: [{
          config: {
            type: "record",
            fields: plugin.getSchema(),
          }
        }],
      },
    }
  }

  // RPC method
  async StartInstance(cfg) {
    let name = cfg.Name
    if (name === undefined || this.plugins[name] === undefined) {
      return Promise.reject(new PluginServerError(name + " not initizlied"))
    }

    let plugin = this.plugins[name]
    let config = JSON.parse(cfg.Config)
    let iid = this.instanceID++
    this.instances[iid] = plugin.new(config)

    this.logger.info("instance #" + iid + " of " + name + " started")

    return {
      "Name": name,
      "Id": iid,
      "Config": config,
      "StartTime": new Date().getTime() / 1000,
    }
  }

  // RPC method
  async InstanceStatus(iid) {
    if (iid === undefined || this.instances[iid] == undefined) {
      // Note: Kong expect the error to start with "no plugin instance"
      return Promise.reject(new PluginServerError("no plugin instance #" + iid))
    }

    let ins = this.instances[iid]
    return {
      Name: ins.getName(),
      Id: iid,
      Config: ins.getConfig(),
      StartTime: ins.getStartTime(),
    }
  }

  // RPC method
  async CloseInstance(iid) {
    if (iid === undefined || this.instances[iid] == undefined) {
      // Note: Kong expect the error to start with "no plugin instance"
      return Promise.reject(new PluginServerError("no plugin instance #" + iid))
    }

    let ins = this.instances[iid]
    ins.close()
    delete this.instances[iid]

    return {
      Name: ins.getName(),
      Id: iid,
      Config: ins.getConfig(),
    }
  }

  // RPC method
  async HandleEvent(event) {
    let iid = event.InstanceId
    if (iid == undefined || this.instances[iid] === undefined) {
      // Note: Kong expect the error to start with "no plugin instance"
      return Promise.reject(new PluginServerError("no plugin instance #" + iid))
    }

    let ins = this.instances[iid]
    ins.resetExpireTs()

    let phase = event.EventName
    let eid = this.eventID++

    let [ch, childCh] = new PipePair().getPair()
    this.events[eid] = ch

    // https://snyk.io/blog/nodejs-how-even-quick-async-functions-can-block-the-event-loop-starve-io/
    setImmediate(() => {
      new Promise(async () => {
        try {
          await ins.executePhase(phase, new PDK(childCh).kong)
        } catch(ex){
          let err = "unhandled exception in " + ins.getName() + "." + phase +
                    " on instance #" + iid + ": " + ex
          this.logger.warn(err)
        }
        childCh.put(MSG_RET)
      })
    })

    let r = await ch.get()
    ins.resetExpireTs()

    return {
      "Data": r,
      "EventId": eid,
    }
  }

  async step(data, isError) {
    let eid = data.EventId
    if (eid === undefined || this.events[eid] === undefined) {
      return Promise.reject(new PluginServerError("event id " + eid + " not found"))
    }

    let din = data.Data
    let ch = this.events[eid]

    if (isError) {
      await ch.put([ undefined, din ])
    } else {
      await ch.put([ din, undefined ])
    }

    let ret = await ch.get()

    if (ret === MSG_RET) {
      delete this.events[eid]
    }

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

  getLogger() {
    return this.logger
  }

  getPlugins() {
    return this.plugins
  }
}

// Generate other RPC methods
for (let i in entities) {
  let entity = entities[i]
  Server.prototype["Step" + entity] = Server.prototype.Step
}

Server.prototype.StepMultiMap = Server.prototype.Step

module.exports = Server
