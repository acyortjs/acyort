const yaml = require('yamljs')
const pathFn = require('path')
const urlFn = require('url')
const defaults = require('./defaults')

const config = yaml.load(pathFn.join(process.cwd(), 'config.yml'))

for (let key in defaults) {
  if (config[key] === undefined || config[key] === null) {
    config[key] = defaults[key]
  }
}

const theUrl = urlFn.parse(config.url)
const theRoot = pathFn.parse(theUrl.path).name

config.url = `${theUrl.protocol}//${theUrl.host}`
config.root = theRoot ? `/${theRoot}` : '/'

if (process.env.NODE_ENV === 'dev') {
  config.dev = true
}

module.exports = config
