const fs = require('fs-extra')
const path = require('path')
const config = require('../config')
const Logger = require('../logger')

class Source {
  constructor() {
    this._config = config
    this._logger = new Logger()
  }

  get _sourceDir() {
    return path.join(process.cwd(), 'themes', this._config.theme, 'source')
  }

  get _publicDir() {
    return path.join(process.cwd(), this._config.public_dir)
  }

  copy() {
    try {
      fs.copySync(this._sourceDir, this._publicDir)
      this._logger.success('Copied files')
    } catch (e) {
      this._logger.error(e)
    }
  }
}

module.exports = Source
