const { join } = require('path')
const fs = require('fs-extra')
const getTemplates = require('./getTemplate')

module.exports = function copySource() {
  const { public: publicDir, base } = this.config
  const publics = join(base, publicDir)
  // const sources = join(base, 'templates', template, 'source')
  const { path: sources } = getTemplates(this.config, 'source')

  if (fs.existsSync(sources)) {
    fs.copySync(sources, publics)
    this.logger.info('copied source files')
  }
}
