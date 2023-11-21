import { join } from 'path'
import { Config } from 'acyort'

export default (cwd: string) => {
  const configPath = join(cwd, 'acyort.config.js')
  const config = require(configPath)
  return config as Config
}
