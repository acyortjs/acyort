const { readdirSync, removeSync } = require('fs-extra')

const KEEPS = [
  'templates',
  'scripts',
  'config.yml',
  'CNAME',
  'README.md',
  'LICENSE',
  '.gitignore',
  'package.json',
  'package-lock.json',
  'node_modules',
  '.git',
]

module.exports = {
  name: 'clean',
  fullName: 'clean',
  description: 'Remove generated files',
  action(argv, { logger }) {
    try {
      readdirSync(process.cwd())
        .filter(file => file[0] !== '.' && KEEPS.indexOf(file) === -1)
        .forEach(file => removeSync(file))
    } catch (e) {
      logger.error(e)
    }
  },
}
