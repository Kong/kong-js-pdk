'use strict';

// This is an example plugin that appends a string in response body

class KongPlugin {
  constructor(config) {
    this.config = config
  }

  async access(kong) {
    // Only need the following if response handler not exist
    // buffered proxying is automatically turned on for plugin
    // with a response handler
    // await kong.service.request.enableBuffering()

    let requestBody = await kong.request.getRawBody()
    // convert it to uppercase
    requestBody = requestBody.replace(/(.)/g, function(v) { return v.toUpperCase(); })

    await Promise.all([
      // append "?js-transform=v0.1.0" to request line to upstream
      kong.service.request.setQuery({
        "js-transform": "v0.1.0",
      }),
      // set the transformed request body to upstream
      kong.service.request.setRawBody(requestBody),
    ])
  }

  // Note: by defining reponse handler implictly turns on buffered proxying
  // on the Route/Service and may break connections like WebSocket
  // and has performance penalty
  async response(kong) {
    if (await kong.response.getSource() == "service") {
      let body = await kong.service.response.getRawBody()

      body = "Response body from upstream:\n" + body + "\nBody size: " + body.length + "\n"

      await kong.response.exit(await kong.response.getStatus(), body)
    }
  }
}

module.exports = {
  Plugin: KongPlugin,
  Schema: [{
    message: {
      type: "string"
    }
  }, ],
  Version: '0.1.0',
  Priority: 0,
}
