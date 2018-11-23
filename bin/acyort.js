#!/usr/bin/env node

const logger = require('@acyort/logger')()
const { join } = require('path')
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
    const { scripts, plugins } = config

    scripts.concat(plugins).forEach((name) => {
      const path = name.includes('.js') ? join(base, 'scripts', name) : name
      // eslint-disable-next-line global-require, import/no-dynamic-require
      require(path)({ ...ctx, process: undefined })
    })

    parser(argv, ctx)
  } else if (argv[0] && !ignores.includes(argv[0])) {
    logger.error('Cannot find `config.yml` or configuration error')
  } else {
    parser(argv)
  }
} catch (e) {
  logger.error(e)
}
