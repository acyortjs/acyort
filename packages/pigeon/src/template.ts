import { Config } from '@acyort/pigeon'
import { AcyOrt } from 'acyort'
import { join } from 'path'
import { existsSync } from 'fs'

export default (acyort: AcyOrt) => {
  const config = acyort.config as Config
  const { template } = config
  const { cwd } = acyort
  const localPath = join(cwd, 'templates', template)

  if (existsSync(localPath)) {
    return localPath
  }

  const npmPath = join(cwd, 'node_modules', template)

  let templateName = template

  try {
    templateName = require(npmPath).template
  } catch (e) {
    // ignore
  }

  const templatePath = join(npmPath, 'templates', templateName)

  if (existsSync(templatePath)) {
    return templatePath
  }

  throw new Error(`template noexists: ${template}`)
}
