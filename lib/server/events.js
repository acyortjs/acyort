const pathFn = require('path')

class Events {
  constructor(theme) {
    this.source = `${theme}/source`
    this.layout = `${theme}/layout`
    this.i18n = `${theme}/i18n`
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
  }
}

module.exports = Events
