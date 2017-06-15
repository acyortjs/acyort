const pathFn = require('path')
const moment = require('moment')
const _ = require('lodash')
const I18n = require('./i18n')

class Helper extends I18n {
  constructor(config) {
    super(config)

    this.posts = []
    this.config = _.omit(config, ['token'])
    this.__ = this.i18n.__
    this._n = this.i18n.__n
    this._time = (time, format) => moment(time).format(format)
    this._posts = () => this.posts.map(p => p.id)
    this._post = (id) => this.posts.find(p => p.id === id)
    this._url = (path) => path ? pathFn.join(config.root, path) : ''
  }

  setPosts(posts) {
    this.posts = posts
  }

  _() {
    return _.pick(this, ['config', '__', '_n', '_time', '_posts', '_post', '_url'])
  }
}

module.exports = Helper
