const { join } = require('path')
const I18n = require('@acyort/i18n')
const logger = require('@acyort/logger')()
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
    moment.locale(language)

    this.methods = {
      __: this.__.bind(this), // eslint-disable-line no-underscore-dangle
      _n: this._n.bind(this), // eslint-disable-line no-underscore-dangle
      _url: (path = '') => join(root, path),
      _time: (time, format) => momentTz(moment(time), timezone).format(format),
    }
    this.defaultMethods = Object.keys(this.methods)
  }

  set language(locale) {
    this.locale = locale
    moment.locale(locale)
  }

  get language() {
    return this.locale
  }

  register(name, fn) {
    if (typeof fn === 'function' && !this.methods[name]) {
      this.methods[name] = fn
    } else {
      logger.warn(`error helper function: ${name}, duplicate name or no a function`)
    }
  }
}
