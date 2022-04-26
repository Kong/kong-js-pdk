'use strict';
var { graphql, buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The rootValue provides a resolver function for each API endpoint
var rootValue = {
  hello: () => {
    return 'Hello world!';
  },
};

// This is an example plugin that add a header to the response

class KongPlugin {
  constructor(config) {
    this.config = config
  }

  async access(kong) {
    let body = await kong.request.getRawBody()

    let response = await graphql({
      schema,
      source: body,
      rootValue
    })

    await kong.response.exit(200, response)
  }
}

module.exports = {
  Plugin: KongPlugin,
  Name: 'js-graphql',
  Schema: [
    { message: { type: "string" } },
  ],
  Version: '0.1.0',
  Priority: 0,
}
