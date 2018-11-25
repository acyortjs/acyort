const assert = require('power-assert')
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

    flow.register(a, b, c)

    assert(flow.scripts.length === 2)
    assert(flow.scripts[0]() === 'a')
  })
})
