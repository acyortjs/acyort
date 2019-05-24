module.exports = class {
  constructor() {
    this.hooks = {}
  }

  tap(type, f) {
    if (this.hooks[type]) {
      throw new Error(`Hook \`${type}\` exists`)
    }
    this.hooks[type] = f
  }

  call(type, ...args) {
    const hook = this.hooks[type]

    if (!hook) {
      return Promise.resolve()
    }

    return Promise.resolve(hook(...args))
  }
}
