#!/usr/bin/env node

const extend = require('@acyort/extender')
const logger = require('@acyort/logger')()
const { join } = require('path')
const { readdirSync, existsSync } = require('fs')
const cli = require('../lib/cli')
const parser = require('../lib/cli/parser')

const argv = process.argv.slice(2)

if (argv[0] !== 'init') {
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
}

parser(argv, logger)
