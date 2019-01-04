const { join } = require('path')
const fs = require('fs-extra')
const logger = require('@acyort/logger')()

function getTemplates(config, ...paths) {
  const { base, template } = config
  let dir = join(base, 'templates', template)
  if (!fs.pathExistsSync(dir)) {
    const modulePath = join(process.cwd(), 'node_modules', template)
    if (fs.existsSync(modulePath)) {
      let tmplConfig = {}
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        tmplConfig = require(`${template}`)
      } catch (e) {
        // .
      }
      const { entry = 'templates' } = tmplConfig
      dir = join(modulePath, entry)
    } else {
      logger.error(`There are not template: ${template} exist`)
    }
  }
  // return join(dir, ...paths)
  return {
    path: join(dir, ...paths),
    root: dir,
  }
}

module.exports = getTemplates
