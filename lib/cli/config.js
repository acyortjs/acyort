const Renderer = require('@acyort/renderer')
const debug = require('debug')
const { join } = require('path')

const renderer = new Renderer()
const log = debug('Error:')
const cwd = process.cwd()

log.enabled = true

module.exports = () => {
  try {
    return renderer.renderFile('yaml', join(cwd, 'config.yml'))
  } catch (e) {
    log('Cannot find "config.yml" or Configuration error')
    return null
  }
}
