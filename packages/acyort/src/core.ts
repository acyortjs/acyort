import signale from 'signale'
import { AcyOrt, Config } from 'acyort'
import cli from './cli/core'

export default class implements AcyOrt {
  public logger

  public version: string

  public config

  public cwd

  public cli

  constructor(cwd: string, config: Config) {
    this.version = require('../package.json').version
    this.logger = signale
    this.config = config
    this.cli = cli
    this.cwd = cwd
  }
}
