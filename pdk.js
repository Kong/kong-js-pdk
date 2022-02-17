'use strict';

const ERROR_NAME = 'PDKError'

class PDKError extends Error {
  get name () {
    return ERROR_NAME
  }

  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, this.constructor)
  }
}

const bridgeHandler = {
  get(target, name) {
    // camelCase to underscore_case
    const clean_name = name.replace(/[a-z][A-Z]/g, (str) => {
      return (str.substring(0, 1) + "_" + str.substring(1)).toLowerCase()
    })
    return newBridgeCall(`${target.prefix}.${clean_name}`, target.call)
  }
}

function newBridgeCall(prefix, call) {
  function bridgeCall(...args) {
    return call(prefix, ...args)
  }
  bridgeCall.prefix = prefix
  bridgeCall.call = call

  return new Proxy(bridgeCall, bridgeHandler);
}

// those methods never return, instead, they exit from current request immediately
const NON_RETURN_METHODS = new Set([
    "kong.response.exit",
    "kong.response.error",
])

function rpcCall(rpcPipe) {
  return async (method, ...args) => {
    rpcPipe.put({
      "Method": method,
      "Args": args,
    })

    if (NON_RETURN_METHODS.has(method))
      return

    const [ret, err] = await rpcPipe.get()

    if (err) {
      throw new PDKError(`PDK method ${method} failed:  ${err}`)
    }
    return ret
  }
}

class Kong {
  get [Symbol.toStringTag]() {
    return 'KongPDK'
  }

  get Error() {
    return PDKError
  }

  static get Error() {
    return PDKError
  }

  constructor(rpcPipe) {
    this.kong = newBridgeCall("kong", rpcCall(rpcPipe))
  }
}

module.exports = Kong
