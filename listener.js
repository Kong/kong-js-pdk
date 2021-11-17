'use strict'

const net = require("net")
const fs = require("fs")
const {Encoder, Decoder} = require("@msgpack/msgpack")
const TYPE_EXP = /^\[object (.*)\]$/
const toString = Object.prototype.toString

function typeOf(value) {
  if (!value) return ''
  const parts = TYPE_EXP.exec(toString.call(value))
  return parts[1].toLowerCase()
}

function write_response (client, msgid, response) {
  client.write(client.encoder.encode([
    1, // is response
    msgid,
    undefined,
    response
  ]))
}

function write_error (client, msgid, error) {
  client.write(client.encoder.encode([
    1, // is response
    msgid,
    error,
    undefined
  ]))
}

function errToString (err) {
  if (typeOf(err) === "pluginservererror") {
    return err.message
  }
  return err.toString()
}

function getStreamDecoder () {
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
  get [Symbol.toStringTag]() {
    return 'PluginListener'
  }

  constructor(pluginServer, prefix) {
    this.ps = pluginServer
    this.prefix = prefix
    this.logger = pluginServer.getLogger()
  }

  serve() {
    const listen_path = this.prefix
    const logger = this.logger

    if (fs.existsSync(listen_path)) {
      fs.unlinkSync(listen_path)
    }

    const server = net.createServer((client) => {
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

        logger.debug(`rpc: #${msgid} method: ${method} args: ${JSON.stringify(args)}`)
        if (!this.ps[cmd]) {
          const err = "method \"" + cmd + "\" not implemented"
          logger.error("rpc: #" + msgid + " " + err)
          write_error(client, msgid, errToString(err))
          return
        }

        let promise
        try {
          promise = this.ps[cmd](...args)
        } catch (ex) {
          logger.error(ex.stack)
          write_error(client, msgid, errToString(ex))
          return
        }

        const type = typeOf(promise)
        if (type !== 'promise') {
          const err = `${cmd} should return a Promise object, got ${type}`
          logger.error("rpc: #" + msgid + " " + err)
          write_error(client, msgid, errToString(err))
          return
        }

        promise
          .then((ret) => {
            write_response(client, msgid, ret)
          })
          .catch((err) => {
            logger.error(`rpc: # ${msgid} ${err}`)
            write_error(client, msgid, errToString(err))
          })
      })
    })

    logger.info("server started at", listen_path)
    server.listen(listen_path)
    return server
  }
}

module.exports = Listener
