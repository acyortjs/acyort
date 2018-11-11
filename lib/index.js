const fs = require('fs-extra')
const logger = require('@acyort/logger')()
const Renderer = require('@acyort/renderer')
const { join } = require('path')
const { version } = require('../package.json')
const Workflow = require('./workflow')
const Helper = require('./helper')
const Store = require('./store')
const cli = require('./cli')
const { defaults } = require('./config')

module.exports = class {
  constructor(config) {
    this.config = config
    this.version = version
    this.fs = fs
    this.logger = logger
    this.renderer = new Renderer()
    this.workflow = new Workflow()
    this.helper = new Helper(config)
    this.cli = cli
    this.store = new Store()
    this.renderEngine = 'swig'
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

  outputHTML(tag, path, data) {
    const { base, public: publicDir, template } = this.config
    const { methods, defaultMethods } = this.helper
    const tpl = join(base, 'templates', template, 'layout', `${tag}.html`)

    if (!fs.existsSync(tpl)) {
      logger.error(`Cannot find template: \`${tpl}\``)
      return
    }

    Object.keys(methods).forEach((name) => {
      if (!defaultMethods.includes(name)) {
        this.helper.methods[name] = methods[name].bind(data)
      }
    })

    const html = this.renderer.renderFile(this.renderEngine, tpl, {
      config: this.config,
      page: data,
      ...this.helper.methods,
    })

    fs.outputFileSync(join(base, publicDir, path), html)
    logger.info(`output: ${path}`)
  }

  copySource() {
    const { public: publicDir, base, template } = this.config
    const publics = join(base, publicDir)
    const sources = join(base, 'templates', template, 'source')

    if (fs.existsSync(sources)) {
      fs.copySync(sources, publics)
      logger.info('copied source files')
    }
  }
}

module.exports.defaults = defaults
