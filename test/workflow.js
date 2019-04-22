const assert = require('power-assert')
const expect = require('expect')
const Workflow = require('../lib/workflow')

describe('workflow', () => {
  it('test', () => {
    const flow = new Workflow()

    function a() {
      return 'a'
    }

    function b() {
      return 'b'
    }

    const c = 'no a function'

    flow.register(a, b)

    expect(() => flow.register(c))
      .toThrow('Function register error, no a function')

    assert(flow.scripts.length === 2)
    assert(flow.scripts[0]() === 'a')
  })
})
