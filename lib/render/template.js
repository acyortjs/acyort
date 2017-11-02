const swig = require('swig-templates')
const path = require('path')
const config = require('../config')
const Logger = require('../logger')

swig.setDefaults({ cache: false })

class Template {
  constructor() {
    this._theme = config.theme
    this._logger = new Logger()
    this._tags = 'index,archives,categories,category,page,post,tag,tags'.split(',')
    this._dir = path.join(process.cwd(), 'themes', this._theme, 'layout')
    this.templates = {}
    this._getTemplates()
  }

  _getTemplates() {
    this._tags.forEach((tag) => {
      try {
        this.templates[tag] = swig.compileFile(path.join(this._dir, `${tag}.html`))
      } catch (e) {
        this._logger.info(`ignore template ${tag}`)
      }
    })
  }
}

module.exports = Template
