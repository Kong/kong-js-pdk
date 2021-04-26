'use strict';

class PDKError extends Error {
  constructor(message) {
    super(message)
    this.name = "PDKError"
  }
}

const bridgeHandler = {
  get(target, name) {
    // camelCase to underscore_case
    name = name.replace(/[a-z][A-Z]/g,
      function (s) {
        return s.substring(0, 1) + "_" + s.substring(1).toLowerCase()
      })
    return newBridgeCall(target.prefix + "." + name, target.call)
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

function rpcCall(rpcPipe) {
  return async (m, ...args) => {
    rpcPipe.put({
      "Method": m,
      "Args": args,
    })
    let [ret, err] = await rpcPipe.get()
    if (err !== undefined) {
      throw new PDKError("PDK method " + m + " failed: " + err)
    }
    return ret
  }
}

class Kong {
  constructor(rpcPipe) {
    this.kong = newBridgeCall("kong", rpcCall(rpcPipe))
  }
}

module.exports = Kong
