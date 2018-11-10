const { join } = require('path')
const Renderer = require('@acyort/renderer')
const defaults = require('./defaults')
const urlParse = require('./url')

const renderer = new Renderer()

module.exports = (base = process.cwd()) => {
  const path = join(base, 'config.yml')

  try {
    const config = renderer.renderFile('yaml', path)

    Object.keys(defaults).forEach((key) => {
      if (config[key] === undefined || config[key] === null) {
        config[key] = defaults[key]
      }
    })

    const { url, root } = urlParse(config.url)

    config.url = url || config.url
    config.root = root || config.root
    config.base = base

    return config
  } catch (e) {
    return null
  }
}

module.exports.defaults = defaults
