#!/usr/bin/env node

const logger = require('@acyort/logger')()
const parser = require('../lib/cli/parser')
const acyort = require('../lib')
const getConfig = require('../lib/config')

const argv = process.argv.slice(2)
const base = process.cwd()
const ignores = ['init', '-h', '--help', '-v', '--version']

try {
  const config = getConfig(base)

  if (config) {
    const ctx = acyort(config)
    parser(argv, { process: ctx.process })
  } else if (argv[0] && !ignores.includes(argv[0])) {
    logger.error('cannot find `config.yml` or configuration error')
  } else {
    parser(argv)
  }
} catch (e) {
  logger.error(e)
}
