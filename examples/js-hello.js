'use strict';

let process = require("process")

// This is an example plugin that add a header to the response

class Plugin {
  constructor(config) {
    this.config = config
  }

  async access(kong) {
    let [host, err] = await kong.request.get_header("host")
    if (err) {
      return await kong.log.err(err)
    }

    let message = this.config.message || "hello"

    await kong.response.set_header("x-hello-from-javascript", "Javascript says " + message + " to " + host)
    await kong.response.set_header("x-javascript-pid", process.pid)
  }
}

module.exports = {
  Plugin: Plugin,
  Schema: [
    { message: { type: "string" } },
  ],
  Version: '0.1.0',
  Priority: 0,
}