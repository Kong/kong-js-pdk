const plugin = require('../examples/js-goodbye')

const {promisify} = require('util')
const sleep = promisify(setTimeout)
const {
  PluginTest,
  Request
} = require('../plugin_test')

test('plugin interface', async () => {
  let r = new Request()
  const start = Date.now() / 1000
  await sleep(1000)

  r
    .useURL("http://example.com")
    .useMethod("GET")
    .useHeaders({
      "Host": "example.com",
    })

  let t = new PluginTest(r)
  const {mod, instance} = await t.Run(plugin, {
    "message": "test",
  })

  expect(mod.getLastStartInstanceTime()).toBeGreaterThan(start)
  expect(mod.getName()).toBe('goodbye')
  expect(mod.getPhases()).toEqual(expect.arrayContaining(['access']))
  expect(mod.getPriority()).toBe(plugin.Priority)
  expect(mod.getVersion()).toBe(plugin.Version)
  expect(mod.getSchema()).toMatchObject(plugin.Schema)

  expect(instance.getName()).toBe('goodbye')
  expect(instance.isExpired(10)).toBe(false)

  const lastCloseInstanceTime = mod.lastCloseInstanceTime + 0
  instance.close()
  await sleep(1000)

  expect(mod.getLastCloseInstanceTime()).toBeGreaterThan(lastCloseInstanceTime)

  expect(instance.getConfig()).toMatchObject({message: 'test'})
  expect(instance.getStartTime()).toBeLessThan(Date.now()/1000)

  instance.resetExpireTs()
  expect(instance.getLastUsedTime()).toBeGreaterThan(0)
});
