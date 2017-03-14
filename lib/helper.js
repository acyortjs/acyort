const i18nFn = require('./i18n')
const pathFn = require('path')
const moment = require('moment')

function Helper() {
  const config = JSON.parse(JSON.stringify(global.config))
  const data = global.data
  const { language } = config

  const { __, __n, getLocale } = i18nFn(language)
  const time = (t, format) => moment(t).format(format)
  const post = id => data.posts.find(p => p.id === id)
  const posts = () => data.posts.map(p => p.id)
  const url = (path) => {
    if (!path) {
      return ''
    }
    return pathFn.join(config.root, path)
  }

  delete config.token

  return Object.assign({ config, time, post, posts, url }, { __, _n: __n, _lang: getLocale })
}

module.exports = Helper
