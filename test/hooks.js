const assert = require('power-assert')
const expect = require('expect')
const Hooks = require('../lib/hooks')

describe('hooks', () => {
  it('test', async () => {
    const hooks = new Hooks()
    const s = {}

    hooks.tap('test', (c) => { c.a = 1 }) // eslint-disable-line
    await hooks.call('test', s)
    assert(s.a === 1)

    await hooks.call('x', s)
    assert(s.a === 1)

    expect(() => hooks.tap('test', () => null)).toThrow('Hook `test` exists')
  })
})
