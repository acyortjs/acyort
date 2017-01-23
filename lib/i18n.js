const I18nFn = require('acyort-i18n')
const pathFn = require('path')
const yaml = require('yamljs')
const config = require('./config')()

function I18n(language) {
    const i18n = {}

    new I18nFn({
        locales: [language],
        register: i18n,
        directory: pathFn.join(process.cwd(), 'themes', config.theme, 'i18n'),
        extension: '.yml',
        parse: data => yaml.parse(data.toString('utf-8')),
    })

    return i18n
}

module.exports = I18n

