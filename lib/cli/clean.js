const { readdirSync, removeSync } = require('fs-extra')
const keeps = require('./keep')
const getConfig = require('./config')

module.exports = {
  name: 'clean',
  fullName: 'clean',
  description: 'Remove generated files',
  action(argv, logger) {
    if (getConfig()) {
      try {
        readdirSync(process.cwd())
          .filter(file => file[0] !== '.' && keeps.indexOf(file) === -1)
          .forEach(file => removeSync(file))
      } catch (e) {
        logger.error(e)
      }
    }
  },
}
