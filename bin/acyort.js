#!/usr/bin/env node

const yargs = require('yargs-parser')
const { join } = require('path')
const pkg = require('../package.json')

const help = `
AcyOrt, A Node.js static website framework

Commands:
  init [folder]       Create new website
  generate            Generate static files
  clean               Remove generated files

Options:
  --version           Show current version
  --help              Show help

For more help, check the docs: https://acyort.com
`
const cwd = process.cwd()

function parse(argv) {
  const { _ } = yargs(argv)

  if (argv[0] === '-v' || argv[0] === '--version') {
    global.console.log(pkg.version)
    return
  }

  if (argv[0] === '-h' || argv[0] === '--help') {
    global.console.log(help)
    return
  }

  if (_[0] === 'init') {
    const to = join(cwd, _[1] || '')
    return
  }

  global.console.log(help)
}

parse(process.argv.slice(2))
