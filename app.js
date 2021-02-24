#!/usr/bin/env node

'use strict'

let path = require('path')

const msgpack = require("msgpack")
const logger = require('node-color-log')

let cli = require(path.join(__dirname, 'modules/cli'))
let Server = require(path.join(__dirname, 'modules/server'))
let Listener = require(path.join(__dirname, 'modules/listener'))

let opts = cli.parse()

logger.setLevel(opts.logLevel)

let ps = new Server(opts.pluginsDirectory, logger)

if (opts.DumpPluginInfo) {
  ps.GetPluginInfo(opts.DumpPluginInfo)
    .then((v) => {
      process.stdout.write(msgpack.pack(v))
    })
} else if (opts.DumpAllPlugins) {
  Promise.all(function* () {
    for (let plugin in ps.getPlugins()) {
      yield ps.GetPluginInfo(plugin)
    }
  }())
  .then((values) => {
    console.log(JSON.stringify(values))
  })
} else {
  let l = new Listener(ps, path.join(opts.kongPrefix, opts.sockName))
  l.serve()
}

ps.close()
