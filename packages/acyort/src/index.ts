import AcyOrt from './core'
import initPlugins from './plugin'
import { Config } from './types'

export default (cwd: string, config: Config) => {
  const ctx = new AcyOrt(cwd, config)
  initPlugins(ctx)
  return ctx
}
