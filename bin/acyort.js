#!/usr/bin/env node

const yargs = require('yargs-parser')
const cli = require('./cli')

function parse(args) {
  const argv = yargs(args)

  let action = cli.getAction('options', args[0])

  if (action) {
    action(argv)
    return
  }

  action = cli.getAction('commands', argv._[0])

  if (action) {
    action(argv)
    return
  }

  global.console.log(cli.help)
}

parse(process.argv.slice(2))
