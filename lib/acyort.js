const fs = require('fs-extra')
const pathFn = require('path')
const { version } = require('../package.json')
const Logger = require('acyort-logger')
const Fetcher = require('acyort-fetcher')
const Marked = require('acyort-marked')
const Processor = require('acyort-processor')
const Extend = require('acyort-extend')
const Render = require('acyort-render')
const Server = require('acyort-server')
const Helper = require('acyort-helper')
const Builder = require('./builder')
const getType = require('./type')

class Acyort {
  constructor(config) {
    const {
      base,
      theme,
      public_dir,
      source_dir,
      layout_dir,
      i18n_dir,
    } = config
    const themeDir = pathFn.join(base, 'themes', theme)

    this.fs = fs
    this.version = version
    this.config = config
    this.logger = new Logger()
    this.renderer = new Render()
    this.markeder = new Marked(config)
    this.fetcher = new Fetcher(config)
    this.helper = new Helper({
      config,
      renderer: this.renderer,
    })
    this.server = new Server({
      watches: [
        pathFn.join(themeDir, source_dir),
        pathFn.join(themeDir, layout_dir),
        pathFn.join(themeDir, i18n_dir),
      ],
      publics: pathFn.join(base, public_dir),
    })
    this.builder = new Builder({
      config,
      logger: this.logger,
      renderer: this.renderer,
      helper: this.helper,
    })
    this.processor = new Processor({
      config,
      markeder: this.markeder,
    })
    this.extend = new Extend(this, [
      'fs',
      'logger',
      'renderer',
      'config',
      'markeder',
      'helper',
      'version',
    ])
    this.fetchData = null
    this.processData = null
  }

  start(port) {
    this.server.trigger = ({ path, clients }) => {
      const type = getType(this.config, path)
      if (!type) {
        return false
      }
      return this.build(type).then(() => {
        const msg = type === 'css' ? 'css' : 'html'
        clients.forEach(client => client.send(msg))
      })
    }
    this.build().then(() => this.server.start(port))
  }

  build(type) {
    this.fetcher.status = status => this.logger.info(status)

    return this.extend.init()
      .then(() => {
        const { helpers } = this.extend
        Object.keys(helpers).forEach(h => this.helper.add(h, helpers[h]))
        return Promise.resolve()
      })
      .then(() => this.extend.run('after_init', null))
      .then(() => {
        if (this.fetchData) {
          return Promise.resolve(this.fetchData)
        }
        return this.fetcher.fetch()
      })
      .then((data) => {
        if (!this.fetchData) {
          this.fetchData = data
        }
        return Promise.resolve(data)
      })
      .then(data => this.extend.run('after_fetch', data))
      .then((data) => {
        const { after_fetch } = this.extend.scripts
        if (after_fetch.length === 0 && this.processData) {
          return Promise.resolve(this.processData)
        }
        return this.processor.process(data)
      })
      .then((data) => {
        if (!this.processData) {
          this.processData = data
        }
        return Promise.resolve(data)
      })
      .then(data => this.extend.run('after_process', data))
      .then(data => this.builder.build({ data, type }))
      .then(data => this.extend.run('after_build', data))
      .catch(err => this.logger.error(err))
  }
}

module.exports = Acyort
