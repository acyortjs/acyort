const fs = require('fs-extra')
const path = require('path')
const config = require('../config')
const Logger = require('../logger')

class Source {
  constructor() {
    this.config = config
    this.logger = new Logger()
  }

  get _sourceDir() {
    return path.join(process.cwd(), 'themes', this.config.theme, 'source')
  }

  get _publicDir() {
    return path.join(process.cwd(), this.config.public_dir)
  }

  copy() {
    try {
      fs.copySync(this.sourceDir, this.publicDir)
      this.logger.success('Copied files')
    } catch (e) {
      this.logger.error(e)
    }
  }
}

module.exports = Source
