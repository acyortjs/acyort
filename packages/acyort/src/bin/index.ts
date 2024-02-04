#!/usr/bin/env node

import signale from 'signale'
import { cwd } from 'node:process'
import getConfig from './config'
import getAcyort from '..'
import cli from '../cli'

const argv = process.argv.slice(2)

try {
  const configName = argv[0] === '-c' ? argv[1] : 'acyort.config.js'
  const config = getConfig(cwd(), configName)
  const acyort = getAcyort(cwd(), config)
  cli(argv[0] === '-c' ? argv.slice(2) : argv, acyort)
} catch (e) {
  signale.fatal(e)
}
