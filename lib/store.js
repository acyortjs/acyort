module.exports = class {
  constructor() {
    this.store = {}
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
