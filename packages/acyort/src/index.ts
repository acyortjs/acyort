import signale from 'signale'
import { version } from '../package.json'
import { Config } from './types'

export default class {
  private logger: typeof signale

  public version: string

  constructor(config: Config) {
    this.version = version
    this.logger = signale
  }
}
