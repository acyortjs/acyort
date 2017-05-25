const swig = require('swig-templates')
const pathFn = require('path')

swig.setDefaults({ cache: false })

class Template {
  constructor(ctx) {
    this.ctx = ctx
    this.tags = 'index,archives,categories,category,page,post,tag,tags'
  }

  get dir() {
    return pathFn.join(process.cwd(), 'themes', this.ctx.theme, 'layout')
  }

  get templates() {
    const templates = {}

    this.tags.split(',').forEach((tag) => {
      try {
        templates[tag] = swig.compileFile(pathFn.join(this.dir, `${tag}.html`))
      } catch (e) {
        //
      }
    })

    return templates
  }
}

module.exports = Template
