const swig = require('swig-templates')
const path = require('path')
const config = require('../../config')
const Logger = require('../../logger')

swig.setDefaults({ cache: false })

class Template {
  constructor() {
    this._theme = config.theme
    this._logger = new Logger()
  }

  get _dir() {
    return path.join(process.cwd(), 'themes', this._theme, 'layout')
  }

  get templates() {
    const tags = 'index,archives,categories,category,page,post,tag,tags'.split(',')
    const templates = {}

    tags.forEach((tag) => {
      try {
        templates[tag] = swig.compileFile(path.join(this._dir, `${tag}.html`))
      } catch (e) {
        this._logger.info(`ignore template ${tag}`)
      }
    })

    return templates
  }
}

module.exports = Template
