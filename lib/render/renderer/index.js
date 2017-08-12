const path = require('path')
const fs = require('fs-extra')
const Template = require('./template')
const config = require('../config')
const Logger = require('../logger')

class Renderer extends Template {
  constructor() {
    super()
    this.config = config
    this.logger = new Logger()
  }

  _path(path) {
    return path.join(process.cwd(), this.config.public_dir, path)
  }

  get _jsonPath() {
    const { json, public_dir } = this.config
    const jsonPath = typeof json === 'boolean' ? '' : json
    return path.join(process.cwd(), public_dir, jsonPath)
  }

  renderJson(path, data) {
    fs.outputFileSync(path.join(this._jsonPath, path), JSON.stringify(data))
    this.logger.success(path)
  }

  render(path, template, data) {
    if (this.templates[template]) {
      fs.outputFileSync(this._path(path), this.templates[template](data))
      this.logger.success(path)
    }
  }
}

module.exports = Renderer
