const yaml = require('yamljs')
const pathFn = require('path')
const url = require('url')
const fs = require('fs-extra')
const defaults = require('./defaults')

const yml = pathFn.join(process.cwd(), 'config.yml')

let config = {}

if (fs.existsSync(yml)) {
  config = yaml.load(yml)
}

Object.keys(defaults).forEach((key) => {
  if (config[key] === undefined || config[key] === null) {
    config[key] = defaults[key]
  }
})

const { protocol, host, path } = url.parse(config.url)
const { name } = pathFn.parse(path)

config.url = `${protocol}//${host}`
config.root = name ? `/${name}` : '/'

if (process.env.NODE_ENV === 'dev') {
  config.dev = true
}

module.exports = config
