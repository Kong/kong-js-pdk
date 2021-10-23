const PDK = require('../pdk')
const PipePair = require('../lib/pipe')

test('kong js pdk', async () => {
  let [_, child] = new PipePair().getPair()
  const pdk = new PDK(child)
  expect('' + pdk).toBe('[object KongPDK]')
  expect(new pdk.Error).toBeInstanceOf(Error)

  {
    const error = new pdk.Error('this is an error')
    expect('' + error).toBe('PDKError: this is an error')
  }

  {
    const error = new PDK.Error('this is an error')
    expect('' + error).toBe('PDKError: this is an error')
  }
})
