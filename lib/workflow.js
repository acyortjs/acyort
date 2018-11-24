const logger = require('@acyort/logger')()

module.exports = class {
  constructor() {
    this.scripts = []
  }

  register(...fns) {
    for (let i = 0; i < fns.length; i += 1) {
      const fn = fns[i]
      if (typeof fn === 'function') {
        this.scripts.push(fn)
      } else {
        logger.error(`Error function: ${fn}, no a function`)
      }
    }
  }
}
