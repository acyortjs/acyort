import { Config } from '@acyort/pigeon'
import { AcyOrt } from 'acyort'
import { join } from 'path'
import { cpSync, existsSync } from 'fs'
import getTemplate from './template'

export default (acyort: AcyOrt) => {
  const { template, public: publicDir = '/' } = acyort.config as Config
  const { cwd } = acyort

  if (!template) {
    return
  }

  const distPath = join(cwd, publicDir, 'assets')
  const srcPath = `${getTemplate(acyort)}/assets`

  if (existsSync(srcPath)) {
    cpSync(srcPath, distPath, { recursive: true })
    acyort.logger.success('copied assets')
  }
}
