'use strict';

// This is an example plugin that sets the response status based on the existence of a header

class KongPlugin {
  constructor(config) {
    this.config = config
  }

  async access(kong) {
    let userId = await kong.request.getHeader("userId")
    if (!userId) {
      return kong.response.exit(403);
    }

    let message = this.config.message || "hello"

    await Promise.all([
      kong.response.setHeader("x-welcome", "Javascript says " + message + " to " + userId),
    ])
  }
}

module.exports = {
  Plugin: KongPlugin,
  Schema: [
    { message: { type: "string" } },
  ],
  Version: '0.1.0',
  Priority: 0,
}
