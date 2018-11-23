const { join } = require('path')
const fs = require('fs-extra')

module.exports = function copySource() {
  const { public: publicDir, base, template } = this.config
  const publics = join(base, publicDir)
  const sources = join(base, 'templates', template, 'source')

  if (fs.existsSync(sources)) {
    fs.copySync(sources, publics)
    this.logger.info('Copied source files')
  }
}
