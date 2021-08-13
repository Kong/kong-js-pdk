'use strict'

const net = require("net")
const fs = require("fs")
const { Encoder, Decoder } = require("@msgpack/msgpack")

let write_response = function (client, msgid, response) {
  client.write(client.encoder.encode([
    1, // is response
    msgid,
    undefined,
    response
  ]))
}

let write_error = function (client, msgid, error) {
  client.write(client.encoder.encode([
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

let getStreamDecoder = function () {
  const decoder = new Decoder()
  let buffer

  return function (chunk) {
    let decoded
    try {
      let data = chunk
      if (buffer !== undefined) {
        buffer.push(chunk)
        data = Buffer.concat(buffer)
      }
      decoded = decoder.decode(data)
      buffer = undefined
    } catch (ex) {
      // TODO: less hacky way to detect insufficient data
      if (ex instanceof RangeError && errToString(ex) == "RangeError: Insufficient data") {
        if (buffer === undefined) {
          buffer = [chunk]
        }
        return
      } else {
        throw ex
      }
    }

    return decoded
  }
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
      client.encoder = new Encoder()
      const decodeStream = getStreamDecoder()

      client.on('data', (chunk) => {
        let decoded = decodeStream(chunk)
        if (decoded === undefined) {
          // partial data received, wait for next chunk
          return
        }

        let [_, msgid, method, args] = decoded
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
