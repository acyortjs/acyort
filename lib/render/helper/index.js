const pathFn = require('path')
const moment = require('moment')
const momentTz = require('moment-timezone')
const _ = require('lodash')
const I18n = require('./i18n')
const fs = require('fs-extra')

class Helper extends I18n {
  constructor(config) {
    super(config)

    moment.locale(config.language)

    this.posts = []
    this.config = _.omit(config, ['token'])
    /* eslint-disable no-underscore-dangle */
    this.__ = this.i18n.__
    this._n = this.i18n.__n
    this._posts = () => this.posts.map(p => p.id)
    this._post = id => this.posts.find(p => p.id === id)
    this._url = path => pathFn.join(config.root, path || '')
    this._time = (time, format) => {
      const t = moment(time)
      return momentTz(t, config.timezone).format(format)
    }
    /* eslint-disable no-underscore-dangle */
  }

  setPosts(posts) {
    this.posts = posts
  }

  resetLocale() {
    const yml = pathFn.join(this.directory, this.locale + this.extension)
    this.locales = { [this.locale]: this.parse(fs.readFileSync(yml)) }
  }

  _() {
    return _.pick(this, ['config', '__', '_n', '_time', '_posts', '_post', '_url'])
  }
}

module.exports = Helper
