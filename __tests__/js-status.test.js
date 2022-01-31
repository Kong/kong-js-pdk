const plugin = require('../examples/js-status');

const {
  PluginTest,
  Request
} = require("../plugin_test")


test('Should succeed with status 200 when header is present', async () => {
  let r = new Request()

  r
    .useURL("http://example.com")
    .useMethod("GET")
    .useHeaders({
      "userId": "test-id",
    })

  let t = new PluginTest(r)

  await t.Run(plugin, {
    "message": "test",
  })

  expect(t.response.status).toBe(200)
  expect(t.response.headers.get('x-welcome'))
    .toBe('Javascript says test to test-id')
});

test('Should exit with status 403 when header is missing', async () => {
  let r = new Request()

  r
    .useURL("http://example.com")
    .useMethod("GET")

  let t = new PluginTest(r)

  await t.Run(plugin, {
    "message": "test",
  })

  expect(t.response.status).toBe(403)
});
