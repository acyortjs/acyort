const path = require('path')
const fs = require('fs-extra')
const Template = require('./template')

class Render extends Template {
  constructor(acyort) {
    super(acyort)
    this._config = acyort.config
    this._logger = acyort.logger
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

  render(htmlPath, template, data) {
    if (this.templates[template]) {
      fs.outputFileSync(this._path(htmlPath), this.templates[template](data))
      this._logger.success(htmlPath)
    }
  }
}

module.exports = Render
