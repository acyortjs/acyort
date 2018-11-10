#!/usr/bin/env node

const extend = require('@acyort/extender')
const logger = require('@acyort/logger')()
const { join } = require('path')
const { readdirSync, existsSync } = require('fs')
const parser = require('../lib/cli/parser')
const Acyort = require('../lib')
const getConfig = require('../lib/config')

const argv = process.argv.slice(2)
const base = process.cwd()
const ignores = ['init', '-h', '--help', '-v', '--version']

if (argv[0] && !ignores.includes(argv[0])) {
  try {
    const config = getConfig(base)
    const scriptsDir = join(base, 'scripts')

    if (config) {
      const acyort = new Acyort(config)

      if (existsSync(scriptsDir)) {
        readdirSync(scriptsDir)
          .filter(name => name.indexOf('.js') > -1)
          .forEach((name) => {
            const path = join(base, 'scripts', name)
            extend(path, acyort, 'acyort')
          })
      }

      parser(argv)
    }
  } catch (e) {
    logger.error(e)
  }
} else {
  parser(argv)
}
