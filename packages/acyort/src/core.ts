import signale from 'signale'
import cli from './cli/core'
import { version } from '../package.json'
import { Config } from './types'

export default class {
  public logger: typeof signale

  public version: string

  public config: Config

  public cli: typeof cli

  constructor(config: Config) {
    this.version = version
    this.logger = signale
    this.config = config
    this.cli = cli
  }
}
