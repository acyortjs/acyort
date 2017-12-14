const pathFn = require('path')

class Type {
  constructor(theme) {
    this.dir = {
      source: `${theme}/source/`,
      layout: `${theme}/layout/`,
      i18n: `${theme}/i18n/`,
    }
    this.tags = [
      'categories',
      'category',
      'tags',
      'tag',
      'archives',
      'page',
      'post',
      'index',
    ]
  }

  get(file) {
    const ext = pathFn.extname(file)
    const { dir, tags } = this

    if (file.indexOf(dir.source) > -1) {
      if (ext === '.css') {
        return 'css'
      }
      return 'static'
    }

    if (file.indexOf(dir.i18n) > -1 && ext === '.yml') {
      return 'i18n'
    }

    if (file.indexOf(dir.layout) === -1 || ext !== '.html') {
      return ''
    }

    const path = file.split(dir.layout)[1]

    if (path.indexOf('/') > -1) {
      return 'html'
    }

    const tag = path.split('.html')[0]

    if (tags.indexOf(tag) > -1) {
      return tag
    }

    return 'html'
  }
}

module.exports = Type
