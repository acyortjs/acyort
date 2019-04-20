const { resolve, join } = require('path')
const { copySync, outputFileSync, existsSync } = require('fs-extra')
const signale = require('signale')

const IGNORES = [
  'Thumbs.db',
  '.DS_Store',
  'templates/',
]

module.exports = {
  name: 'init',
  fullName: 'init [folder]',
  description: 'Create new website',
  action({ _ }) {
    const cwd = process.cwd()
    const assetsPath = resolve(__dirname, '../../../assets')
    const [, path = ''] = _
    const ignoresPath = join(cwd, path, '.gitignore')

    const filter = (src) => {
      const srcName = src.split(assetsPath)[1]
      if (srcName && /.*?[a-z]\..*?[a-z]/.test(srcName) && existsSync(join(cwd, srcName))) {
        return false
      }
      return true
    }

    try {
      copySync(assetsPath, join(cwd, path), { filter })
      if (!existsSync(ignoresPath)) {
        outputFileSync(ignoresPath, IGNORES.join('\n'))
      }
      signale.success('Configure `config.yml` to start')
    } catch (e) {
      signale.error(e)
    }
  },
}
