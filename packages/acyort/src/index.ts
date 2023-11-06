import AcyOrt from './core'
import initPlugins from './plugin'
import { Config } from './types'

export default (config: Config) => {
  const ctx = new AcyOrt(config)
  initPlugins(ctx)
  return ctx
}
