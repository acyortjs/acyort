const I18N = require('i18n-2')
const pathFn = require('path')
const yaml = require('yamljs')
const config = require('./config')()

const i18n = new I18N({
    locales: config.language,
    directory: pathFn.join(process.cwd(), 'themes', config.theme, 'i18n'),
    extension: '.yml',
    parse: data => yaml.parse(data.toString('utf-8')),
})

console.log( i18n.__('tag') )
