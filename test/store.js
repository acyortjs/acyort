const assert = require('power-assert')
const Store = require('../lib/store')

describe('store', () => {
  it('test', () => {
    const store = new Store()

    store.set('key', 'key')
    assert(store.store.key === 'key')

    store.set('key', 'other')
    assert(store.store.key === 'key')

    assert(store.get('key') === 'key')
  })
})
