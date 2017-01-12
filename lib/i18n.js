const I18n2 = require('i18n-2')
const pathFn = require('path')
const yaml = require('yamljs')
const config = require('./config')()

function I18n() {
    const i18n = {}

    new I18n2({
        locales: config.language,
        register: i18n,
        directory: pathFn.join(process.cwd(), 'themes', config.theme, 'i18n'),
        extension: '.yml',
        parse: data => yaml.parse(data.toString('utf-8')),
    })

    console.log(i18n.__n('tag_cloud', 0))
    return i18n
}

module.exports = I18n

