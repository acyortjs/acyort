const path = require('path')
const config = require('../config')

class Events {
  constructor() {
    const { theme } = config
    this._source = `${theme}/source`
    this._layout = `${theme}/layout`
    this._i18n = `${theme}/i18n`
    this._tags = 'categories,tags,archives,category,tag'.split(',')
  }

  get(file) {
    const ext = path.extname(file)

    if (file.indexOf(this._source) > -1) {
      if (ext === '.css') {
        return 'css'
      }
      return 'static'
    }

    if (file.indexOf(this._i18n) > -1 && ext === '.yml') {
      return 'yml'
    }

    if (file.indexOf(this._layout) > -1 && ext === '.html') {
      const tag = file.split(this._layout)[1].split('.html')[0].slice(1)
      const index = this._tags.indexOf(tag)

      if (tag === 'page') {
        return 'pages'
      }
      if (tag === 'index') {
        return 'page'
      }
      if (tag === 'post') {
        return 'posts'
      }
      if (index > -1) {
        return this._tags[index]
      }

      return 'html'
    }

    return 'unknow'
  }
}

module.exports = Events
