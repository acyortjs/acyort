const yaml = require('yamljs')
const pathFn = require('path')
const urlFn = require('url')
const fs = require('fs-extra')
const Logger = require('../logger')
const defaults = require('./defaults')

const configPath = pathFn.join(process.cwd(), 'config.yml')
const logger = new Logger()

if (!fs.existsSync(configPath)) {
  logger.error('Cannot find "config.yml"')
  process.exit(0)
}

const config = yaml.load(configPath)

Object.keys(defaults).forEach((key) => {
  if (config[key] === undefined || config[key] === null) {
    config[key] = defaults[key]
  }
})

const theUrl = urlFn.parse(config.url)
const theRoot = pathFn.parse(theUrl.path).name

config.url = `${theUrl.protocol}//${theUrl.host}`
config.root = theRoot ? `/${theRoot}` : '/'

if (process.env.NODE_ENV === 'dev') {
  config.dev = true
}

module.exports = config
