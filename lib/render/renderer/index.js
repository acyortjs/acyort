const path = require('path')
const fs = require('fs-extra')
const Template = require('./template')
const config = require('../../config')
const Logger = require('../../logger')

class Renderer extends Template {
  constructor() {
    super()
    this._config = config
    this._logger = new Logger()
  }

  _path(filePath) {
    return path.join(process.cwd(), this._config.public_dir, filePath)
  }

  get _jsonPath() {
    const { json, public_dir } = this._config
    const jsonPath = typeof json === 'boolean' ? '' : json
    return path.join(process.cwd(), public_dir, jsonPath)
  }

  renderJson(jsonPath, data) {
    fs.outputFileSync(path.join(this._jsonPath, jsonPath), JSON.stringify(data))
    this._logger.success(jsonPath)
  }

  render(path, template, data) {
    if (this.templates[template]) {
      fs.outputFileSync(this._path(path), this.templates[template](data))
      this._logger.success(path)
    }
  }
}

module.exports = Renderer
