const fs = require('fs-extra')
const logger = require('@acyort/logger')()
const Renderer = require('@acyort/renderer')
const axios = require('axios')
const { join } = require('path')
const { version } = require('../package.json')
const Workflow = require('./workflow')
const Helper = require('./helper')
const Store = require('./store')
const cli = require('./cli')
const { defaults } = require('./config')

const acyort = {
  version,
  fs,
  logger,
  renderer: new Renderer(),
  workflow: new Workflow(),
  cli,
  store: new Store(),
  axios,
}

module.exports = (config) => {
  acyort.config = config
  acyort.helper = new Helper(config)
  acyort.process = () => {
    const { scripts } = acyort.workflow
    const exec = (script) => {
      if (scripts.length) {
        Promise.all([script()])
          .then(() => {
            scripts.splice(0, 1)
            exec(scripts[0])
          })
          .catch(err => acyort.logger.error(err))
      }
    }

    exec(scripts[0])
  }
  acyort.outputHTML = ({
    template: tag,
    path,
    data,
    engine = 'swig',
  }) => {
    const { base, public: publicDir, template } = acyort.config
    const { methods, defaultMethods } = acyort.helper
    const tpl = join(base, 'templates', template, 'layout', `${tag}.html`)

    if (!fs.existsSync(tpl)) {
      logger.error(`Cannot find template: \`${tpl}\``)
      return
    }

    Object.keys(methods).forEach((name) => {
      if (!defaultMethods.includes(name)) {
        acyort.helper.methods[name] = methods[name].bind(data)
      }
    })

    const html = acyort.renderer.renderFile(engine, tpl, {
      config: acyort.config,
      page: data,
      ...acyort.helper.methods,
    })

    fs.outputFileSync(join(base, publicDir, path), html)
    logger.info(`output: ${path}`)
  }
  acyort.copySource = () => {
    const { public: publicDir, base, template } = acyort.config
    const publics = join(base, publicDir)
    const sources = join(base, 'templates', template, 'source')

    if (fs.existsSync(sources)) {
      fs.copySync(sources, publics)
      logger.info('copied source files')
    }
  }

  return acyort
}

module.exports.defaults = defaults
