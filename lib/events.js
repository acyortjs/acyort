const path = require('path')

class Events {
  constructor(acyort) {
    const {
      theme,
      source_dir: sourceDir,
      layout_dir: layoutDir,
      i18n_dir: i18nDir,
    } = acyort.config
    this.dir = {
      source: `${theme}/${sourceDir}/`,
      layout: `${theme}/${layoutDir}/`,
      i18n: `${theme}/${i18nDir}/`,
    }
    this.template = acyort.template
  }

  check(file) {
    const ext = path.extname(file)

    if (file.indexOf(this.dir.source) > -1) {
      if (ext === '.css') {
        return 'css'
      }
      return 'static'
    }

    if (file.indexOf(this.dir.i18n) > -1) {
      return 'i18n'
    }

    if (ext !== '.html') {
      return ''
    }

    const current = file.split(this.dir.layout)[1]

    if (current.indexOf('/') > -1) {
      return 'html'
    }

    const template = current.split('.html')[0]

    if (this.template.templates.indexOf(template) > -1) {
      return template
    }

    return 'html'
  }
}

module.exports = Events
