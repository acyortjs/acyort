const assert = require('power-assert')
const Store = require('../lib/store')

describe('store', () => {
  const stores = new Store()
  it('test global store', () => {
    stores.set('key', 'key')
    assert(stores.global.store.key === 'key')

    stores.set('key', 'other')
    assert(stores.global.store.key === 'other')

    assert(stores.get('key') === 'other')

    stores.reset()
    assert(stores.get('key') === undefined)
  })

  it('test register store', () => {
    const namespace = 'kvjzlkjv'
    stores.register(namespace)
    const store = stores.bind(namespace)
    assert(store === stores.modules[namespace])
  })
  it('test namespace store', () => {
    const namespace = 'fdsafdaf'
    const store = stores.bind(namespace)
    store.set('key', 'key')
    assert(store.get('key') === 'key')
    assert(stores.get(`${namespace}:key`) === 'key')
    const other = 'ooooooo'
    stores.set(`${namespace}:other`, other)
    assert(store.get('other') === other)
    assert(stores.get(`${namespace}:other`) === other)

    stores.reset(namespace)
    assert(store.get('other') === undefined)
    assert(stores.get(`${namespace}:other`) === undefined)
  })

  it('test get store without register', () => {
    const namespace = '1231651'
    const valu = 'valu'
    stores.set(`${namespace}:key`, valu)
    assert(stores.get(`${namespace}:key`) === valu)
  })
})
