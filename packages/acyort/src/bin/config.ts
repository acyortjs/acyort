import { join } from 'path'
import { Config } from '../types'

export default (cwd: string) => {
  const configPath = join(cwd, 'acyort.config.js')
  const config = require(configPath)
  return { ...config, cwd } as Config
}
