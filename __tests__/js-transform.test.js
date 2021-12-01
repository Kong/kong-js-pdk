const plugin = require('../examples/js-transform');

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
    .useBody("all lower case")

  let t = new PluginTest(r)

  await t.Run(plugin, {})

  expect(t.serviceRequest.body)
    .toBe('ALL LOWER CASE')

  expect(t.serviceRequest.url.search)
    .toBe('?js-transform=v0.1.0')

  expect(t.response.status)
    .toBe(200)

  expect(t.serviceResponse.body)
    .toBe("OK")

  expect(t.response.body)
    .toBe(
      `Response body from upstream:
OK
Body size: 2
`)

})
