const logger = require('@acyort/logger')()

module.exports = class {
  constructor() {
    this.store = {}
  }

  set(key, data) {
    if (!this.store[key]) {
      this.store[key] = data
    } else {
      logger.error(`Error set data: ${key}, duplicate key`)
    }
  }

  get(key) {
    return this.store[key]
  }

  reset() {
    this.store = {}
  }
}
