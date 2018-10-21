#!/usr/bin/env node

const extend = require('@acyort/extender')
const yargs = require('yargs-parser')
const { join } =require('path')
const { readdirSync } = require('fs')
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

try {
  const cwd = process.cwd()

  readdirSync(join(cwd, 'scripts'))
    .filter(name => name.indexOf('.js') > -1)
    .forEach((name) => {
      const path = join(cwd, 'scripts', name)
      extend(path, { cli }, 'acyort')
    })
} catch (e) {
  global.console.error(e)
}

parse(process.argv.slice(2))
