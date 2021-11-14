'use strict';

require('ts-node').register();
const fs = require('fs')

const phases = ['certificate', 'rewrite', 'log', 'access', 'preread', 'response']
const noop = () => {}
class Module {
  constructor(name, path, literal) {
    this.loadTime = Date.now() / 1000
    this.mod = null

    if (path) {
      this.mod = require(path)
      this.mtime = fs.statSync(path).mtime.getTime() / 1000
      this.location = path
    } else if (literal) {
      this.mod = literal
      // use mtime of current script instead
      this.mtime = fs.statSync(__filename).mtime.getTime() / 1000
    } else {
      throw new Error('either path or module needs to be passed in')
    }

    const plugin_name = (this.mod.Name || name).toLowerCase()
    this.path = path
    this.cls = this.mod.Plugin
    this.name = plugin_name
    this.phases = []

    for (const phase of phases) {
      if (typeof this.cls.prototype[phase] == 'function') {
        this.phases.push(phase)
      }
    }

    this.priority = this.mod.Priority || 0
    this.version = this.mod.Version
    this.schema = this.mod.Schema || []

    this.lastStartInstanceTime = 0
    this.lastCloseInstanceTime = 0
  }

  new(config) {
    this.lastStartInstanceTime = Date.now() / 1000
    return new Instance(this.name, config, this.cls, this.setLastCloseInstanceTime.bind(this))
  }

  setLastCloseInstanceTime() {
    this.lastCloseInstanceTime = Date.now() / 1000
  }

  getLastCloseInstanceTime() {
    return this.lastCloseInstanceTime
  }

  getLastStartInstanceTime() {
    return this.lastStartInstanceTime
  }

  getMTime() {
    return this.mtime
  }

  getName() {
    return this.name
  }

  getLoadTime() {
    return this.loadTime
  }

  getPhases() {
    return this.phases
  }

  getPriority() {
    return this.priority
  }

  getVersion() {
    return this.version
  }

  getSchema() {
    return this.schema
  }
}

class Instance {
  constructor(name, config, cls, closeCb = noop) {
    this.cls = new cls(config)
    this.name = name
    this.config = config
    this.startTime = Date.now() / 1000
    this.lastUsedTime = 0
    this.closeCb = closeCb
  }

  isExpired(ttl = 60) {
    const until = Date.now() / 1000 - ttl
    return this.startTime < until && this.lastUsedTime < until
  }

  resetExpireTs() {
    this.lastUsedTime = Date.now() / 1000
    return this.cls
  }

  close() {
    this.closeCb()
  }

  executePhase(phase, ctx) {
    return this.cls[phase](ctx)
  }

  getName() {
    return this.name
  }

  getConfig() {
    return this.config
  }

  getStartTime() {
    return this.startTime
  }

  getLastUsedTime() {
    return this.lastUsedTime
  }
}

module.exports = {
  Module: Module,
  Instance: Instance,
}
