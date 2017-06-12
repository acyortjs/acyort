const pathFn = require('path')
const fs = require('fs-extra')
const Template = require('./template')

class Renderer extends Template {
  constructor(config) {
    super(config.theme)
    this.config = config
  }

  getPath(path) {
    return pathFn.join(process.cwd(), this.config.public_dir, path)
  }

  render(path, template, data) {
    if (!this.templates[template]) {
      return false
    }

    fs.outputFileSync(getPath(path), this.templates[template](data))
  }
}

module.exports = Renderer
