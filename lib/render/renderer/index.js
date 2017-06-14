const pathFn = require('path')
const fs = require('fs-extra')
const Template = require('./template')

class Renderer extends Template {
  constructor(acyort) {
    const { config, logger } = acyort

    super(config.theme)
    this.config = config
    this.logger = logger
  }

  getPath(path) {
    return pathFn.join(process.cwd(), this.config.public_dir, path)
  }

  render(path, template, data) {
    if (!this.templates[template]) {
      return false
    }

    this.logger.success(path)

    fs.outputFileSync(this.getPath(path), this.templates[template](data))
  }
}

module.exports = Renderer
