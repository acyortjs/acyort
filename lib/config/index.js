const { join, resolve } = require('path')
const { existsSync } = require('fs-extra')
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
    const path = join(base, 'config.yml')
    if (!existsSync(path)) {
      return null
    }
    config = renderer.renderFile('yaml', path)
  } else {
    const opt = arg || {}
    config = { ...opt }
    base = opt.base || process.cwd()
  }
  config.base = resolve(base)
  Object.keys(defaults).forEach((key) => {
    if (config[key] === undefined || config[key] === null) {
      config[key] = defaults[key]
    }
  })
  const { url, root } = urlParse(config.url)

  config.url = url || defaults.url
  config.root = root || config.root
  config.templatePath = getTemplatePath(config)

  return config
}
