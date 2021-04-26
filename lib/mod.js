'use strict';

require('ts-node').register();
const fs = require("fs")

const phases = ["certificate", "rewrite", "log", "access", "preread", "response"]

class Module {
  constructor(name, path, module) {
    this.name = name
    this.loadTime = new Date().getTime() / 1000

    let mod
    if (path !== undefined) {
      let f = /(.+)\.([^.]+)$/.exec(path)
      if (f[1] === undefined) {
        throw new Error(path + " doesn't contain a split")
      }
      mod = require(f[2].toLowerCase() == "js" ? f[1]: path)
      this.mod = mod
      this.mtime = fs.statSync(path).mtime.getTime() / 1000
    } else if (module !== undefined) {
      mod = module
      // use mtime of current script instead
      this.mtime = fs.statSync(__filename).mtime.getTime() / 1000
    } else {
      throw new Error("either path or module needs to be passed in")
    }

    this.path = path
    this.cls = mod.Plugin

    this.phases = []
    for (let i in phases) {
      let phase = phases[i]
      if (this.cls.prototype[phase] !== undefined) {
        this.phases.push(phase)
      }
    }

    this.priority = mod.Priority || 0
    this.version = mod.Version
    this.schema = mod.Schema || []

    this.lastStartInstanceTime = 0
    this.lastCloseInstanceTime = 0
  }

  new(config) {
    this.lastStartInstanceTime = new Date().getTime() / 1000
    return new Instance(this.name, config, this.cls, this.setLastCloseInstanceTime)
  }

  setLastCloseInstanceTime() {
    this.lastCloseInstanceTime = new Date().getTime() / 1000
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
  constructor(name, config, cls, closeCb) {
    this.cls = new cls(config)
    this.name = name
    this.config = config
    this.startTime = new Date().getTime() / 1000
    this.lastUsedTime = 0
    this.closeCb = closeCb
  }

  isExpired(ttl) {
    ttl = ttl || 60
    let until = new Date().getTime() / 1000 - ttl
    return this.startTime < until && this.lastUsedTime < until
  }

  resetExpireTs() {
    this.lastUsedTime = new Date().getTime() / 1000
    return this.cls
  }

  close() {
    this.closeCb && this.closeCb()
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
