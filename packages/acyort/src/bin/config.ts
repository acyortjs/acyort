import { join } from 'path'
import { Config } from 'acyort'

export default (cwd: string, configName: string) => {
  const configPath = join(cwd, configName)
  const config = require(configPath)
  return config as Config
}
