const { join } = require('path')
const { existsSync } = require('fs-extra')
const signale = require('signale')

module.exports = ({ base, template }) => {
  const localPath = join(base, 'templates', template)
  const npmPath = join(base, 'node_modules', template)

  if (existsSync(localPath)) {
    return localPath
  }

  let name = template

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    name = require(npmPath).template || template
  } catch (e) {
    // ignore
  }

  const templatePath = join(npmPath, 'templates', name)

  if (existsSync(templatePath)) {
    return templatePath
  }

  signale.error(`Template no exist: ${template}`)
  return undefined
}
