const { join } = require('path')
const { existsSync } = require('fs-extra')
const logger = require('@acyort/logger')()

module.exports = ({ base, template }) => {
  const localPath = join(base, 'templates', template)
  const npmPath = join(base, 'node_modules', template, 'templates', template)

  if (existsSync(localPath)) {
    return localPath
  }

  if (existsSync(npmPath)) {
    return npmPath
  }

  logger.error(`template no exist: ${template}`)
  return undefined
}
