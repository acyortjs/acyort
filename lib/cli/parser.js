const logger = require('@acyort/logger')()
const yargs = require('yargs-parser')
const cli = require('.')
const version = require('./commands/version')
const clean = require('./commands/clean')
const init = require('./commands/init')
const flow = require('./commands/flow')
const help = require('./commands/help')

cli.register('commands', init)
cli.register('commands', flow)
cli.register('commands', clean)
cli.register('options', version)
cli.register('options', {
  name: '--help',
  alias: '-h',
  description: 'Show help',
  action() {
    logger.log(help.call(cli))
  },
})

module.exports = (args, acyort) => {
  const argv = yargs(args)

  let action = cli.getAction('options', args[0])

  if (action) {
    action.call(acyort || { logger }, argv)
    return
  }

  action = cli.getAction('commands', argv._[0])

  if (action) {
    action.call(acyort || { logger }, argv)
    return
  }

  logger.log(help.call(cli))
}
