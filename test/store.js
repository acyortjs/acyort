const assert = require('power-assert')
const Store = require('../lib/store')

describe('store', () => {
  it('test', () => {
    const store = new Store()

    store.set('key', 'key')
    assert(store.store.key === 'key')

    store.set('key', 'other')
    assert(store.store.key === 'other')

    assert(store.get('key') === 'other')

    store.reset()
    assert(store.get('key') === undefined)
  })
})
