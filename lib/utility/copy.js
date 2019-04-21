const { join } = require('path')
const { existsSync, copySync } = require('fs-extra')

module.exports = function copySource() {
  const { public: publicDir, base, templatePath } = this.config

  if (!templatePath) {
    return
  }

  const publics = join(base, publicDir)
  const sources = join(templatePath, 'source')

  if (existsSync(sources)) {
    copySync(sources, publics)
    this.logger.success('Copied source files')
  }
}
