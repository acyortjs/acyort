#!/usr/bin/env node

import signale from 'signale'
import { cwd } from 'node:process'
import getConfig from './config'
import getAcyort from '..'
import cli from '../cli'

const argv = process.argv.slice(2)

try {
  if (!argv.length) {
    cli(argv)
  } else {
    const config = getConfig(cwd())
    const acyort = getAcyort(cwd(), config)
    cli(argv, acyort)
  }
} catch (e) {
  signale.fatal(e)
}
