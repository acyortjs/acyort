const Renderer = require('@acyort/renderer')
const logger = require('@acyort/logger')()
const { join } = require('path')

const renderer = new Renderer()

module.exports = () => {
  try {
    return renderer.renderFile('yaml', join(process.cwd(), 'config.yml'))
  } catch (e) {
    logger.error('Cannot find `config.yml` or configuration error')
    return null
  }
}
