module.exports = class {
  constructor() {
    this.scripts = []
  }

  register(fn) {
    if (typeof fn === 'function') {
      this.scripts.push(fn)
    }
  }
}
