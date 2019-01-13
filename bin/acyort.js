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
    const storeMethods = Object
      .getOwnPropertyNames(Object.getPrototypeOf(store))
      .filter(n => n !== 'constructor')

    const exec = (path) => {
      const name = path.split('/').slice(-1)[0]
      const binder = {
        context: store,
        namespace: path.includes('node_modules')
          ? `plugin:${name}`
          : `script:${name.split('.')[0]}`,
      }
      const methods = {}

      storeMethods.forEach((n) => {
        methods[n] = store[n].bind(binder)
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

    scripts.forEach(name => exec(join(base, 'scripts', name)))
    plugins.forEach(name => exec(join(base, 'node_modules', name)))

    parser(argv, { process: ctx.process })
  } else if (argv[0] && !ignores.includes(argv[0])) {
    logger.error('cannot find `config.yml` or configuration error')
  } else {
    parser(argv)
  }
} catch (e) {
  logger.error(e)
}
