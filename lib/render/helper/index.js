const pathFn = require('path')
const moment = require('moment')
const _ = require('lodash')
const I18n = require('./i18n')

class Helper extends I18n {
  constructor(config, posts) {
    super(config)

    this.config = _.omit(config, ['token'])
    this.__ = this.i18n.__
    this._n = this.i18n.__n
    this.date = (time, format) => moment(t).format(format)
    this.posts = () => posts.map(p => p.id)
    this.post = (id) => posts.find(p => p.id === id)
    this.url = (path) => path ? pathFn.join(config.root, path) : ''
  }

  _() {
    return _.pick(this, ['config', '__', '_n', 'date', 'posts', 'post', 'url'])
  }
}

module.exports = Helper
