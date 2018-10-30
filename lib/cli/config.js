const Renderer = require('@acyort/renderer')
const Logger = require('@acyort/logger')
const { join } = require('path')

const renderer = new Renderer()
const logger = new Logger()
const cwd = process.cwd()

module.exports = () => {
  try {
    return renderer.renderFile('yaml', join(cwd, 'config.yml'))
  } catch (e) {
    logger.error('Cannot find `config.yml` or configuration error')
    return null
  }
}
