const { join } = require('path')
const I18n = require('@acyort/i18n')
const logger = require('@acyort/logger')()
const moment = require('moment')
const momentTz = require('moment-timezone')

module.exports = class extends I18n {
  constructor(config) {
    const {
      base,
      template,
      i18n_dir: i18nDir,
      language,
      root,
      timezone,
    } = config
    const dir = join(base, 'templates', template, i18nDir)

    super(dir, language)

    this.config = config
    this.moment = moment

    this.moment.locale(language)

    this.methods = {
      __: this.__.bind(this), // eslint-disable-line no-underscore-dangle
      _n: this._n.bind(this), // eslint-disable-line no-underscore-dangle
      _url: (path = '') => join(root, path),
      _time: (time, format) => momentTz(this.moment(time), timezone).format(format),
    }
  }

  register(name, fn) {
    if (typeof fn === 'function' && !this.methods[name]) {
      this.methods[name] = fn.bind(this.store)
    } else {
      logger.error(`Error helper function: ${name}. Duplication or No a function`)
    }
  }

  reset() {
    const { language } = this.config
    this.moment.locale(language)
    this.locale = language
  }
}
