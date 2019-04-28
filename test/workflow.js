const assert = require('power-assert')
const expect = require('expect')
const Workflow = require('../lib/workflow')

describe('workflow', () => {
  it('register', () => {
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

  it('test', async () => {
    const test = []
    const error = []
    const flow = new Workflow()

    flow.scripts = [
      () => new Promise((resolve) => {
        setTimeout(() => {
          test.push('b')
          resolve()
        }, 100)
      }),
      () => test.push('a'),
      () => { throw new Error('error') },
    ]

    try {
      await flow.start()
    } catch (e) {
      error.push(e.message)
    }

    assert(test.join('') === 'ba')
    assert(error.join('') === 'error')

    flow.scripts.splice(2, 1)

    await flow.start()

    assert(test.join('') === 'baba')
    assert(error.join('') === 'error')
  })
})
