const { join } = require('path')
const I18n = require('@acyort/i18n')
const moment = require('moment')
const momentTz = require('moment-timezone')

module.exports = class extends I18n {
  constructor(config) {
    const {
      templatePath,
      language,
      root,
      timezone,
    } = config
    const dir = templatePath ? join(templatePath, 'i18n') : ''

    super(dir, language)

    this.methods = {
      __: (...args) => {
        this.locale = config.language
        return this.__(...args) // eslint-disable-line no-underscore-dangle
      },
      _n: (...args) => {
        this.locale = config.language
        return this._n(...args) // eslint-disable-line no-underscore-dangle
      },
      _url: (path = '') => join(root, path.toLowerCase()),
      _time: (t, f) => momentTz(moment(t).locale(config.language), timezone).format(f),
    }
  }

  get(name) {
    if (name === undefined) {
      return this.methods
    }
    return this.methods[name]
  }

  register(name, fn) {
    if (typeof fn === 'function' && !this.methods[name]) {
      this.methods[name] = fn
    } else {
      throw new Error(`Helper function register error: ${name}, duplicate name or no a function`)
    }
  }
}
