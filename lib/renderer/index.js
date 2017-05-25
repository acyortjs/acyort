const pathFn = require('path')
const fs = require('fs')
const Template = require('./template')

class Renderer extends Template {
  constructor(ctx) {
    super(ctx)
  }

  getPath(path) {
    return pathFn.join(process.cwd(), this.ctx.public_dir, path)
  }

  render(path, template, data) {
    if (!this.templates[template]) {
      return false
    }

    fs.outputFileSync(getPath(path), this.templates[template](data))
  }
}
