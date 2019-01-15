const assert = require('power-assert')
const Store = require('../lib/store')

describe('store', () => {
  const store = new Store()
  const methods = ['set', 'get', 'reset']

  it('test', () => {
    const methods1 = {}
    const methods2 = {}

    methods.forEach((m) => {
      methods1[m] = store[m].bind({ context: store, namespace: 'script:script.js' })
      methods2[m] = store[m].bind({ context: store, namespace: 'plugin:plugin' })
    })

    const store1 = { ...store, ...methods1 }
    const store2 = { ...store, ...methods2 }

    store1.set('key', 'key')
    assert(store.store[0].data === 'key')
    assert(store.store[0].key === 'script:script.js:key')
    assert(store1.get('key') === 'key')

    store2.set('key', 'key')
    assert(store.store.length === 2)

    store2.reset()
    assert(store.store.length === 1)
    assert(store2.get('key') === undefined)

    assert(store2.get('key', 'script.js') === 'key')
    assert(store1.get('key', 'plugin') === undefined)
  })
})
