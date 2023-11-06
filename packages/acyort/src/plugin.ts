import { join } from 'path'
import type AcyOrt from './core'

export default (acyort: AcyOrt) => {
  acyort.config.plugins.forEach((nameOrPath) => {
    const localPath = join(acyort.cwd, nameOrPath)
    const npmPath = join(acyort.cwd, 'node_modules', nameOrPath)

    try {
      const module = require(localPath)
    } catch (e0) {
      acyort.logger.error(e1)
      try {
        const module = require(npmPath)
      } catch (e1) {
        acyort.logger.error(e1)
      }
    }
  })
}
