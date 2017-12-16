const fs = require('fs-extra')
const pathFn = require('path')
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
    this.fs = fs
    this.config = config
    this.logger = new Logger()
    this.renderer = new Render()
    this.markeder = new Marked(config)
    this.fetcher = new Fetcher(config)
    this.helper = new Helper({
      config,
      renderer: this.renderer
    })
    this.builder = new Builder({
      config,
      logger: this.logger,
      renderer: this.renderer,
    })
    this.processor = new Processor({
      config,
      markeder: this.markeder,
    })
    this.server = new Server(config.base, {
      listen: pathFn.join('themes', config.theme),
      public: config.public_dir,
    })
    this.extend = new Extend(this, [
      'fs',
      'logger',
      'renderer',
      'config',
      'markeder',
      'server',
      'helper',
    ])
    this.fetchData = null
    this.processData = null
  }

  start(port) {
    const listener = ({ path, clients }) => {
      const type = getType(this.config, path)

      if (!type) {
        return false
      }

      return this.build(type).then(() => {
        const msg = type === 'css' ? 'css' : 'html'
        clients.forEach(client => client.send(msg))
      })
    }
    this.server.addListener(listener)
    this.build().then(() => this.server.start(port))
  }

  build(type) {
    this.fetcher.status = status => this.logger.info(status)

    return this.extend.init()
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
      .then(data => this.builder.build({ data, helpers: this.extend.helpers, type }))
      .then(data => this.extend.run('after_build', data))
      .catch(err => this.logger.error(new Error(err)))
  }
}

module.exports = Acyort
