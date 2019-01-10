const { join } = require('path')
const fs = require('fs-extra')

module.exports = function copySource() {
  const { public: publicDir, base, templatePath } = this.config

  if (!templatePath) {
    return
  }

  const publics = join(base, publicDir)
  const sources = join(templatePath, 'source')

  if (fs.existsSync(sources)) {
    fs.copySync(sources, publics)
    this.logger.info('copied source files')
  }
}
