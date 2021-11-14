'use strict';

import kong from "../kong"

// This is an example plugin that add a header to the response

class KongPlugin {
  config: any;
  constructor(config: any) {
    this.config = config
  }

  async access(kong: kong) {
    let host = await kong.request.getHeader("host")
    if (host === undefined) {
      return await kong.log.err("unable to get header for request")
    }

    let message = this.config.message || "hello"

    // the following can be "parallel"ed
    await Promise.all([
      kong.response.setHeader("x-hello-from-javascript", "Javascript says " + message + " to " + host),
      kong.response.setHeader("x-javascript-pid", process.pid),
    ])
  }
}

module.exports = {
  Plugin: KongPlugin,
  Name: 'hello',
  Schema: [
    { message: { type: "string" } },
  ],
  Version: '0.1.0',
  Priority: 0,
}
