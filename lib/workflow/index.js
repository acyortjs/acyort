module.exports = class {
  constructor() {
    this.scripts = []
    this.register = this.register.bind(this)
    this.start = this.start.bind(this)
  }

  register(...fns) {
    for (let i = 0; i < fns.length; i += 1) {
      const fn = fns[i]
      if (typeof fn === 'function') {
        this.scripts.push(fn)
      } else {
        throw new Error('Function register error, no a function')
      }
    }
  }

  start() {
    const scripts = this.scripts.slice()

    return new Promise((resolve, reject) => {
      const exec = (script) => {
        if (scripts.length) {
          Promise.resolve(script())
            .then(() => {
              scripts.splice(0, 1)
              exec(scripts[0])
            })
            .catch(e => reject(e))
        } else {
          resolve()
        }
      }
      exec(scripts[0])
    })
  }
}
