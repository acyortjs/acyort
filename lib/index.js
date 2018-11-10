const fs = require('fs-extra')
const logger = require('@acyort/logger')()
const Renderer = require('@acyort/renderer')
const { version } = require('../package.json')
const Workflow = require('./workflow')
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
    this.workflow = new Workflow()
    this.helper = new Helper(config)
    this.cli = cli
  }

  process() {
    const { scripts } = this.workflow
    const exec = (script) => {
      if (scripts.length) {
        Promise.all([script()])
          .then(() => {
            scripts.splice(0, 1)
            exec(scripts[0])
          })
          .catch(err => this.logger.error(err))
      }
    }

    exec(scripts[0])
  }
}

module.exports.defaults = defaults
