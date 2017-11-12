const yaml = require('yamljs')
const pathFn = require('path')
const url = require('url')
const fs = require('fs-extra')
const defaults = require('./defaults')

const isDev = process.env.NODE_ENV === 'dev'
const isTest = process.env.NODE_ENV === 'test'
const cwd = process.cwd()

let yml = pathFn.join(cwd, 'config.yml')
let config = {}

if (isTest) {
  yml = pathFn.join(cwd, 'assets', 'config.yml')
}

if (fs.existsSync(yml)) {
  config = yaml.load(yml)
}

if (isTest) {
  config.url += '/test'
}

Object.keys(defaults).forEach((key) => {
  if (config[key] === undefined || config[key] === null) {
    config[key] = defaults[key]
  }
})

if (config.url && /^(https?):\/\/.+$/.test(config.url)) {
  const { protocol, host, path } = url.parse(config.url)
  config.url = `${protocol}//${host}`

  if (path) {
    const { name } = pathFn.parse(path)

    if (name) {
      config.root = `/${name}`
    }
  }
}

if (isDev || isTest) {
  config.dev = true
}


module.exports = config
