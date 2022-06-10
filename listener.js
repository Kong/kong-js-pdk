'use strict'

const net = require('net')
const fs = require('fs')
const {Encoder, Decoder} = require('@msgpack/msgpack')
const TYPE_EXP = /^\[object (.*)\]$/
const ERR_UNKNOWN = 'Unknown plugin listener error encountered'
const toString = Object.prototype.toString

function typeOf(value) {
  if (!value) return ''
  const parts = TYPE_EXP.exec(toString.call(value))
  return parts[1].toLowerCase()
}

function thenable(obj) {
  if (!obj) return false
  return (typeof obj.then === 'function' && typeof obj.catch === 'function')
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
    errToString(error),
    undefined
  ]))
}

function errToString (err) {
  if (typeof err === 'string') return err
  if ('message' in err) return err.message
  if (typeof err.toString === 'function') return err.toString()
  return ERR_UNKNOWN
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
      if (ex.message === 'Insufficient data') {
        if (buffer === undefined) {
          buffer = [chunk]
        }
        return
      }

      throw ex
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

    try {
      fs.unlinkSync(listen_path)
    } catch (ex) {
      if (ex.code !== 'ENOENT') throw ex
    }

    const server = net.createServer((client) => {
      client.encoder = new Encoder()
      const decodeStream = getStreamDecoder()

      client.on('data', (chunk) => {
        let decoded = decodeStream(chunk)

        // partial data received, wait for next chunk
        if (!decoded) return

        let [_, msgid, method, args] = decoded
        let [ns, cmd] = method.split('.')
        if (ns !== 'plugin') {
          write_error(client, msgid, `RPC for ${ns} is not supported`)
          return
        }

        logger.debug(`rpc: #${msgid} method: ${method} args: ${JSON.stringify(args)}`)
        if (!this.ps[cmd]) {
          const err = `method ${cmd} not implemented`
          logger.error(`rpc: #${msgid} ${err}`)
          write_error(client, msgid, err)
          return
        }

        let promise
        try {
          promise = this.ps[cmd](...args)
        } catch (ex) {
          logger.error(ex.stack)
          write_error(client, msgid, ex)
          return
        }

        if (!thenable(promise)) {
          const err = `${cmd} should return a Promise or thenable object, got ${typeOf(promise)}`
          logger.error(`rpc: #${msgid} ${err}`)
          write_error(client, msgid, err)
          return
        }

        promise
          .then((ret) => {
            write_response(client, msgid, ret)
          })
          .catch((err) => {
            logger.error(`rpc: # ${msgid} ${err}`)
            write_error(client, msgid, err)
          })
      })
    })

    server.listen(listen_path)
    logger.info('server started at', listen_path)
    return server
  }
}

module.exports = Listener
