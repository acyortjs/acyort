const logger = require('@acyort/logger')()

module.exports = class {
  constructor() {
    this.store = {}
  }

  set store(data) {
    logger.error('Cannot set store directly')
    return this.store
  }

  setStore(key, data) {
    if (!this.store[key]) {
      this.store[key] = data
    } else {
      logger.warn('Cannot set data, duplicate store key')
    }
  }

  resetStore() {
    this.store = {}
  }
}
