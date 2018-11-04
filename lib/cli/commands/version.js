const { version } = require('../../../package.json')

module.exports = {
  name: '--version',
  alias: '-v',
  description: 'Show current version',
  action(argv, logger) {
    const { version: node, platform } = process
    logger.log(`acyort: ${version}`, `\nnode: ${node}`, `\nos: ${platform}`)
  },
}