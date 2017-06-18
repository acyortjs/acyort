const pathFn = require('path')

class Events {
  constructor(theme) {
    this.source = `${theme}/source`
    this.layout = `${theme}/layout`
    this.i18n = `${theme}/i18n`
    this.tags = 'categories,tags,archives,category,tag'.split(',')
  }

  ext(file) {
    return pathFn.extname(file)
  }

  _(file) {
    const ext = this.ext(file)

    if (file.indexOf(this.source) > -1) {
      if (ext === '.css') {
        return 'css'
      }
      return 'static'
    }

    if (file.indexOf(this.i18n) > -1 && ext === '.yml') {
      return 'yml'
    }

    if (file.indexOf(this.layout) > -1 && ext === '.html') {
      const path = file.split(this.layout)[1].split('.html')[0].slice(1)
      const index = this.tags.indexOf(path)

      if (path === 'page') {
        return 'pages'
      }

      if (path === 'index') {
        return 'page'
      }

      if (path === 'post') {
        return 'posts'
      }

      if (index > -1) {
        return this.tags[index]
      }

      return 'html'
    }

    return 'unknow'
  }
}

module.exports = Events
