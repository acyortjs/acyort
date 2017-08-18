const path = require('path')
const moment = require('moment')
const momentTz = require('moment-timezone')
const _ = require('lodash')
const I18n = require('./i18n')
const fs = require('fs-extra')
const config = require('../../config')

class Helper extends I18n {
  constructor() {
    const { language, timezone, root } = config

    super()
    moment.locale(language)

    const { __, __n } = this._i18n

    this.config = _.omit(config, ['token'])

    this.__ = __
    this._n = __n
    this._postsData = []
    this._posts = () => this._postsData.map(p => p.id)
    this._post = id => this._postsData.find(p => p.id === id)
    this._url = dir => path.join(root, dir || '')
    this._time = (time, format) => momentTz(moment(time), timezone).format(format)
  }

  setPosts(posts) {
    this._postsData = posts
  }

  resetLocales() {
    const { directory, locale, extension, parse } = this
    const ymlPath = path.join(directory, locale + extension)
    this.locales = { [locale]: parse(fs.readFileSync(ymlPath)) }
  }

  get functions() {
    return _.pick(this, ['config', '__', '_n', '_time', '_posts', '_post', '_url'])
  }
}

module.exports = Helper
