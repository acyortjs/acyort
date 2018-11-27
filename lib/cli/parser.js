const logger = require('@acyort/logger')()
const yargs = require('yargs-parser')
const cli = require('./index')

module.exports = (args, acyort) => {
  const argv = yargs(args)

  let action = cli.getAction('options', args[0])

  if (action) {
    action(argv, acyort || { logger })
    return
  }

  action = cli.getAction('commands', argv._[0])

  if (action) {
    action(argv, acyort || { logger })
    return
  }

  logger.log(cli.help)
}
