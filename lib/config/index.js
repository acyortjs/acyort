const _ = require('lodash')
const yaml = require('yamljs')
const pathFn = require('path')
const urlFn = require('url')

const defaults = require('./defaults')
const isDev = process.env.NODE_ENV === 'dev'

if (isDev) {
    defaults.user = 'LoeiFy'
    defaults.repository = 'Recordum'
    defaults.url = 'https://acyortjs.github.io'
}

let config = yaml.load(pathFn.join(process.cwd(), 'config.yml'))
console.log(config)
console.log(defaults)

config = _.defaults(defaults, config)

const theUrl = urlFn.parse(config.url)
const theRoot = pathFn.parse(theUrl.path).name

config.url = `${theUrl.protocol}//${theUrl.host}`
config.root = theRoot ? `/${theRoot}` : '/'

module.exports = config
