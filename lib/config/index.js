const { join } = require('path')
const Renderer = require('@acyort/renderer')
const defaults = require('./defaults')
const getTemplatePath = require('./template')
const urlParse = require('./url')

const renderer = new Renderer()

module.exports = (arg) => {
  let config
  try {
    if (typeof arg === 'string') {
      const path = join(arg, 'config.yml')
      config = renderer.renderFile('yaml', path)
      config.base = arg
    } else {
      config = Object.assign({}, arg || {})
      config.base = arg.base || process.cwd()
    }
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
  } catch (e) {
    return null
  }
}
