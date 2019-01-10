const { join } = require('path')
const { existsSync } = require('fs-extra')
const logger = require('@acyort/logger')()

module.exports = ({ base, template }) => {
  const currentPath = join(base, 'templates', template)
  const npmPath = join(base, 'node_modules', template, 'templates', template)

  if (existsSync(currentPath)) {
    return currentPath
  }

  if (existsSync(npmPath)) {
    return npmPath
  }

  logger.error(`template no exist: ${template}`)
  return undefined
}
