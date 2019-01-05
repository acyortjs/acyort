const { join, dirname } = require('path')
const fs = require('fs-extra')
const logger = require('@acyort/logger')()

function getTemplates(config, ...paths) {
  const { base, template } = config
  let dir = join(base, 'templates', template)
  if (!fs.pathExistsSync(dir)) {
    try {
      const modulePath = dirname(require.resolve(`${template}/package.json`))
      // const modulePath = join(process.cwd(), 'node_modules', template)
      let tmplConfig = {}
      try {
        // error when package.json/main not exist
        // eslint-disable-next-line global-require, import/no-dynamic-require
        tmplConfig = require(`${template}`)
      } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND') {
          throw e
        }
      }
      const { entry = 'templates' } = tmplConfig
      dir = join(modulePath, entry)
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        logger.error(`There are not template: ${template} exist`)
      }
    }
  }
  // return join(dir, ...paths)
  return {
    path: join(dir, ...paths),
    root: dir,
  }
}

module.exports = getTemplates
