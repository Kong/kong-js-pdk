'use strict';

// This is an example plugin that add a header to the response

class KongPlugin {
  constructor(config) {
    this.config = config
    this.message = config.message || 'goodbye'
  }

  async access(kong) {
    await Promise.all([
      kong.response.setHeader('x-goodbye-from-javascript', `Javascript says ${this.message}`),
      kong.response.setHeader('x-javascript-pid', process.pid),
    ])
  }
}

module.exports = {
  Plugin: KongPlugin,
  Name: 'goodbye',
  Schema: [
    { message: { type: 'string' } },
  ],
  Version: '0.1.0',
  Priority: 0,
}
