import { join } from 'path'
import { AcyOrt } from 'acyort'

export default (acyort: AcyOrt) => {
  const exec = (path: string) => {
    const module = require(path)
    module(acyort)
  }

  const { plugins = [], scripts = [] } = acyort.config

  plugins.forEach((name) => {
    const npmPath = join(acyort.cwd, 'node_modules', name)
    exec(npmPath)
  })

  scripts.forEach((path) => {
    const localPath = join(acyort.cwd, path)
    exec(localPath)
  })
}
