const yaml = require('yamljs')
const pathFn = require('path')
const url = require('url')
const fs = require('fs-extra')
const defaults = require('./defaults')

const isDev = process.env.NODE_ENV === 'dev'
const yml = pathFn.join(process.cwd(), 'config.yml')
const config = fs.existsSync(yml) ? yaml.load(yml) : {}

Object.keys(defaults).forEach((key) => {
  if (config[key] === undefined || config[key] === null) {
    config[key] = defaults[key]
  }
})

const { protocol, host, path } = url.parse(config.url)
const { name } = pathFn.parse(path)

config.url = `${protocol}//${host}`
config.root = name ? `/${name}` : '/'
config.dev = isDev ? true : config.dev

module.exports = config
