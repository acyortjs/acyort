const { join, resolve } = require('path')
const Renderer = require('@acyort/renderer')
const defaults = require('./defaults')
const getTemplatePath = require('./template')
const urlParse = require('./url')

const renderer = new Renderer()

module.exports = (arg) => {
  let config
  let base

  if (typeof arg === 'string') {
    base = arg
    try {
      config = renderer.renderFile('yaml', join(base, 'config.yml'))
    } catch (e) {
      return null
    }
  } else {
    config = arg || {}
    base = config.base || process.cwd()
  }

  config.base = resolve(base)

  Object.keys(defaults).forEach((key) => {
    if (config[key] === undefined || config[key] === null) {
      config[key] = defaults[key]
    }
  })

  const { url, root } = urlParse(config.url)

  config.url = url === undefined ? defaults.url : url
  config.root = root || config.root
  config.templatePath = getTemplatePath(config)

  return config
}
