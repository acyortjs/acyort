class Filter {
  constructor() {
    this.types = [
      'after_init',
      'after_fetch',
      'after_process',
      'after_build',
    ]
    this.scripts = {
      after_init: [],
      after_fetch: [],
      after_process: [],
      after_build: [],
    }
  }

  register(type, fn) {
    if (this.types.indexOf(type) > -1 && typeof fn === 'function') {
      this.scripts[type].push(fn)
    }
  }

  reset() {
    Object.keys(this.scripts).forEach((type) => {
      this.scripts[type] = []
    })
  }
}

module.exports = Filter
