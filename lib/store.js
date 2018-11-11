const logger = require('@acyort/logger')()

module.exports = class {
  constructor() {
    this.store = {}
  }

  set(key, data) {
    if (!this.store[key]) {
      this.store[key] = data
    } else {
      logger.warn('Cannot set data, duplicate store key')
    }
  }

  get(key) {
    return this.store[key]
  }

  reset() {
    this.store = {}
  }
}
