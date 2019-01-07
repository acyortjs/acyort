// const logger = require('@acyort/logger')()

function parse(p) {
  return p.split(':')
}

class Store {
  constructor() {
    this.store = {}
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
  }

  set(key, data) {
    this.store[key] = data
  }

  get(key) {
    return this.store[key]
  }

  reset() {
    this.store = {}
  }
}


module.exports = class {
  constructor() {
    this.modules = {}
    this.global = new Store()
  }

  register(namespace) {
    this.modules[namespace] = new Store()
  }

  bind(namespace) {
    const store = this.modules[namespace]
    if (typeof store === 'undefined') {
      this.register(namespace)
    }
    return this.modules[namespace]
  }

  // split by ':' like namespace:key
  set(path, data) {
    const [namespace, key] = parse(path)
    if (key) {
      this.bind(namespace).set(key, data)
    } else {
      this.global.set(path, data)
    }
  }

  // split by ':' like namespace:key
  get(path) {
    const [namespace, key] = parse(path)
    if (key) {
      return this.bind(namespace).get(key)
    }
    return this.global.get(path)
  }

  reset(namespace) {
    if (namespace) {
      this.bind(namespace).reset()
    } else {
      this.global.reset()
    }
  }
}
