const swig = require('swig-templates')
const path = require('path')

swig.setDefaults({ cache: false })

class Template {
  constructor(acyort) {
    this._logger = acyort.logger
    this._tags = 'index,archives,categories,category,page,post,tag,tags'
    this._dir = path.join(process.cwd(), 'themes', acyort.config.theme, 'layout')
    this.templates = {}
    this.getTemplates()
  }

  getTemplates(liveReload) {
    this._tags
    .split(',')
    .forEach((tag) => {
      try {
        this.templates[tag] = swig.compileFile(path.join(this._dir, `${tag}.html`))
      } catch (e) {
        if (!liveReload) {
          this._logger.info(`ignore template ${tag}`)
        }
      }
    })
  }
}

module.exports = Template
