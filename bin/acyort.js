#!/usr/bin/env node

const extend = require('@acyort/extender')
const Logger = require('@acyort/logger')
const yargs = require('yargs-parser')
const { join } = require('path')
const { readdirSync, existsSync } = require('fs')
const cli = require('../lib/cli')

const logger = new Logger()

function parse(args) {
  const argv = yargs(args)

  let action = cli.getAction('options', args[0])

  if (action) {
    action(argv, logger)
    return
  }

  action = cli.getAction('commands', argv._[0])

  if (action) {
    action(argv, logger)
    return
  }

  logger.log(cli.help)
}

try {
  const cwd = process.cwd()
  const scriptsDir = join(cwd, 'scripts')

  if (existsSync(scriptsDir)) {
    readdirSync(join(cwd, 'scripts'))
      .filter(name => name.indexOf('.js') > -1)
      .forEach((name) => {
        const path = join(cwd, 'scripts', name)
        extend(path, { cli }, 'acyort')
      })
  }
} catch (e) {
  logger.error(e)
}

parse(process.argv.slice(2))
