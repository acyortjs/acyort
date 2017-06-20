const AcyortI18n = require('acyort-i18n')
const pathFn = require('path')
const yaml = require('yamljs')

class I18n extends AcyortI18n {
  constructor(config) {
    const { theme, language } = config
    const i18n = {}

    super({
      locales: [language],
      register: i18n,
      directory: pathFn.join(process.cwd(), 'themes', theme, 'i18n'),
      extension: '.yml',
      parse: data => yaml.parse(data.toString('utf-8')),
    })

    this.i18n = i18n
  }
}

module.exports = I18n
