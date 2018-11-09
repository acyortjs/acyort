#!/usr/bin/env node

const extend = require('@acyort/extender')
const logger = require('@acyort/logger')()
const { join } = require('path')
const { readdirSync, existsSync } = require('fs')
const parser = require('../lib/cli/parser')
const Acyort = require('../lib')
const getConfig = require('../lib/config')

const argv = process.argv.slice(2)

if (argv[0] !== 'init') {
  try {
    const cwd = process.cwd()
    const scriptsDir = join(cwd, 'scripts')
    const config = getConfig(cwd)
    const acyort = new Acyort(config)

    if (existsSync(scriptsDir)) {
      readdirSync(join(cwd, 'scripts'))
        .filter(name => name.indexOf('.js') > -1)
        .forEach((name) => {
          const path = join(cwd, 'scripts', name)
          extend(path, acyort, 'acyort')
        })
    }
  } catch (e) {
    logger.error(e)
  }
}

parser(argv, logger)
