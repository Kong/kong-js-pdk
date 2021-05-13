'use strict'

const net = require("net")
const fs = require("fs")
const msgpack = require("msgpack")

let write_response = function (client, msgid, response) {
  client.write(msgpack.pack([
    1, // is response
    msgid,
    undefined,
    response
  ]))
}

let write_error = function (client, msgid, error) {
  client.write(msgpack.pack([
    1, // is response
    msgid,
    error,
    undefined
  ]))
}

let errToString = function(err) {
  if (err && err.name === "PluginServerError") {
    return err.message
  }
  return err.toString()
}


class Listener {
  constructor(pluginServer, prefix) {
    this.ps = pluginServer
    this.prefix = prefix
    this.logger = pluginServer.getLogger()
  }

  serve() {
    let listen_path = this.prefix

    if (fs.existsSync(listen_path)) {
      fs.unlinkSync(listen_path)
    }

    var unixServer = net.createServer((client) => {
      client.on('data', (data) => {
        let [_, msgid, method, args] = msgpack.unpack(data)
        let [ns, cmd] = method.split(".")
        if (ns != "plugin") {
          write_error(client, msgid, "RPC for %s is not supported" % ns)
          return
        }

        this.logger.debug("rpc: #" + msgid + " method: " + method + " args: " + JSON.stringify(args))
        if (this.ps[cmd] === undefined) {
          let err = "method \"" + cmd + "\" not implemented"
          this.logger.error("rpc: #" + msgid + " " + err)
          write_error(client, msgid, errToString(err))
          return
        }

        let promise
        try {
          promise = this.ps[cmd](...args)
        } catch (ex) {
          this.logger.error(ex.stack)
          write_error(client, msgid, errToString(ex))
          return
        }

        if (! promise instanceof Promise) {
          let err = cmd + " should return a Promise object, got " + typeof(promise)
          this.logger.error("rpc: #" + msgid + " " + err)
          write_error(client, msgid, errToString(err))
          return
        }

        promise
          .then((ret) => {
            write_response(client, msgid, ret)
          })
          .catch((err) => {
            this.logger.error("rpc: #" + msgid + " " + err)
            write_error(client, msgid, errToString(err))
          })
        // .finally(function() {
        //   this.logger.debug("rpc: #" + msgid + " method: " + method + " finished")
        // })
      })
    })
    this.logger.info("server started at", listen_path)
    unixServer.listen(listen_path)
  }
}

module.exports = Listener
