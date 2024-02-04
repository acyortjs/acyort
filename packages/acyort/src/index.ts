import { Config } from 'acyort'
import AcyOrt from './core'
import initPlugins from './plugin'

export default (cwd: string, config: Config) => {
  const ctx = new AcyOrt(cwd, config)
  initPlugins(ctx)
  return ctx
}
