const AcyortI18n = require('acyort-i18n')
const fs = require('fs-extra')
const path = require('path')
const yaml = require('yamljs')
const config = require('../../config')

class I18n extends AcyortI18n {
  constructor() {
    const { theme, language } = config
    const i18n = {}
    const i18nDir = path.join('themes', theme, 'i18n')

    let directory = path.join(process.cwd(), i18nDir)

    if (!fs.existsSync(directory)) {
      directory = path.join(path.resolve(__dirname, '../../../assets'), i18nDir)
    }

    super({
      locales: [language],
      register: i18n,
      directory,
      extension: '.yml',
      parse: data => yaml.parse(data.toString('utf-8')),
    })

    this._i18n = i18n
  }
}

module.exports = I18n
