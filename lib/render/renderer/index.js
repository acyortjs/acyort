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

  get path() {
    const jsonPath = typeof this.config.json === 'boolean' ? '' : this.config.json
    return pathFn.join(process.cwd(), this.config.public_dir, jsonPath)
  }

  renderJson(path, data) {
    fs.outputFileSync(pathFn.join(this.path, path), JSON.stringify(data))
    this.logger.success(path)
  }

  render(path, template, data) {
    if (!this.templates[template]) {
      return false
    }

    fs.outputFileSync(this.getPath(path), this.templates[template](data))
    this.logger.success(path)
  }
}

module.exports = Renderer
