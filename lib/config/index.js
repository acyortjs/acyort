const yaml = require('yamljs')
const pathFn = require('path')
const url = require('url')
const fs = require('fs-extra')
const defaults = require('./defaults')

function getConfig(dir = '') {
  const yml = pathFn.join(process.cwd(), dir, 'config.yml')

  if (!fs.existsSync(yml)) {
    return defaults
  }

  const config = yaml.load(yml)

  Object.keys(defaults).forEach((key) => {
    if (config[key] === undefined || config[key] === null) {
      config[key] = defaults[key]
    }
  })

  if (process.env.NODE_ENV === 'dev') {
    config.dev = true
  }

  if (!config.url || !/^(https?):\/\/.+$/.test(config.url)) {
    return config
  }

  const {
    protocol,
    host,
    path,
  } = url.parse(config.url)

  config.url = `${protocol}//${host}`

  if (!path) {
    return config
  }

  const { name } = pathFn.parse(path)

  if (name) {
    config.root = `/${name}`
  }

  return config
}

module.exports = getConfig
