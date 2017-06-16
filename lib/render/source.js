const fs = require('fs-extra')
const pathFn = require('path')

class Source {
  constructor(acyort) {
    const { config, logger } = acyort

    this.config = config
    this.logger = logger
  }

  get sourceDir() {
    return pathFn.join(process.cwd(), 'themes', this.config.theme, 'source')
  }

  get publicDir() {
    return pathFn.join(process.cwd(), this.config.public_dir)
  }

  _() {
    try {
      fs.copySync(this.sourceDir, this.publicDir)
      this.logger.success('Copied files')
    } catch (e) {
      this.logger.error(e)
    }
  }
}

module.exports = Source
