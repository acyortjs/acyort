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
    const exec = (path) => {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      require(path)({ ...ctx, process: undefined })
    }

    scripts.forEach(name => exec(join(base, 'scripts', name)))
    plugins.forEach(name => exec(join(base, 'node_modules', name)))

    parser(argv, ctx)
  } else if (argv[0] && !ignores.includes(argv[0])) {
    logger.error('cannot find `config.yml` or configuration error')
  } else {
    parser(argv)
  }
} catch (e) {
  logger.error(e)
}
