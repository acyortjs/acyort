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
    const { store } = ctx
    const { getPrototypeOf, getOwnPropertyNames } = Object
    const storeMethods = getOwnPropertyNames(getPrototypeOf(store))

    const exec = (path, type, name) => {
      const methods = {}

      storeMethods.forEach((m) => {
        if (m !== 'constructor') {
          methods[m] = store[m].bind({ context: store, namespace: `${type}:${name}` })
        }
      })

      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        require(path)({
          ...ctx,
          process: undefined,
          store: { ...store, ...methods },
        })
      } catch (e) {
        // ignore
      }
    }

    scripts.forEach(name => exec(join(base, 'scripts', name), 'script', name))
    plugins.forEach(name => exec(join(base, 'node_modules', name), 'plugin', name))

    parser(argv, { process: ctx.process })
  } else if (argv[0] && !ignores.includes(argv[0])) {
    logger.error('cannot find `config.yml` or configuration error')
  } else {
    parser(argv)
  }
} catch (e) {
  logger.error(e)
}
