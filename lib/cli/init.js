const { resolve, join } = require('path')
const { copySync, outputFileSync } = require('fs-extra')
const ignores = require('./ignore')

module.exports = {
  name: 'init',
  fullName: 'init [folder]',
  description: 'Create new website',
  action({ _ }, logger) {
    const dir = __dirname
    const cwd = process.cwd()
    const [, path = ''] = _

    const filter = (src, dest) => {
      console.log(src)
      console.log(dest)
      return true
    }

    try {
      copySync(resolve(dir, '../../assets'), join(cwd, path), { filter })
      outputFileSync(join(cwd, path, '.gitignore'), ignores)
      logger.success('Configure `config.yml` to start')
    } catch (e) {
      logger.error(e)
    }
  },
}
