const fs = require('fs-extra')
const logger = require('@acyort/logger')()
const Renderer = require('@acyort/renderer')
const { version } = require('../package.json')
const Wordflow = require('./worlflow')
const Helper = require('./helper')
const Store = require('./store')
const cli = require('./cli')
const { defaults } = require('./config')

module.exports = class extends Store {
  constructor(config) {
    super()

    this.config = config
    this.version = version
    this.fs = fs
    this.logger = logger
    this.renderer = new Renderer()
    this.wordflow = new Wordflow()
    this.helper = new Helper(config)
    this.cli = cli
  }
}

module.exports.defaults = defaults
