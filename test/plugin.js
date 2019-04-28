const { resolve } = require('path')
const assert = require('power-assert')
const plugin = require('../lib/plugin')

class Store {
  constructor() {
    this.store = []
  }

  set(v) {
    this.context.store.push(v)
  }
}

describe('workflow', () => {
  const acyort = {
    workflow: { start: () => null },
    config: {
      base: resolve(__dirname, './fixtures/plugins'),
      plugins: ['script.js', 'plugin'],
    },
    store: new Store(),
    logger: {
      error: s => global.console.log(s.message),
    },
  }

  it('test', () => {
    plugin(acyort)
    assert(acyort.store.store.join() === 'script,plugin')
  })
})
