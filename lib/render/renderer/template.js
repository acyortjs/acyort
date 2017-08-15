const swig = require('swig-templates')
const path = require('path')
const config = require('../../config')
const Logger = require('../../logger')

swig.setDefaults({ cache: false })

class Template {
  constructor() {
    this.theme = config.theme
    this.logger = new Logger()
  }

  get _dir() {
    return path.join(process.cwd(), 'themes', this.theme, 'layout')
  }

  get templates() {
    const tags = 'index,archives,categories,category,page,post,tag,tags'.split(',')
    const templates = {}

    tags.forEach((tag) => {
      try {
        templates[tag] = swig.compileFile(path.join(this._dir, `${tag}.html`))
      } catch (e) {
        this.logger.info(`ignore template ${tag}`)
      }
    })

    return templates
  }
}

module.exports = Template
