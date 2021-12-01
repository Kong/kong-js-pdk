const plugin = require('../examples/js-hello');

const {
  PluginTest,
  Request
} = require("../plugin_test")


test('Set headers in response', async () => {
  let r = new Request()

  r
    .useURL("http://example.com")
    .useMethod("GET")
    .useHeaders({
      "Host": "example.com",
    })

  let t = new PluginTest(r)

  await t.Run(plugin, {
    "message": "test",
  })

  expect(t.response.headers.get('x-hello-from-javascript'))
    .toBe('Javascript says test to example.com')
});
