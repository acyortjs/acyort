const { version } = require('../../package.json')

module.exports = {
  name: '--version',
  alias: '-v',
  description: 'Show current version',
  action() {
    global.console.log(version)
  },
}
