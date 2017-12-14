const fs = require('fs-extra')
const path = require('path')
const Logger = require('acyort-logger')
const Fetcher = require('acyort-fetcher')
const Marked = require('acyort-marked')
const Processor = require('acyort-processor')
const Extend = require('acyort-extend')
const Render = require('acyort-render')
const Server = require('acyort-server')
const Builder = require('./builder')
const Type = require('./type')

class Acyort {
  constructor(config) {
    this.fs = fs
    this.timer = null
    this.config = config
    this.logger = new Logger()
    this.renderer = new Render()
    this.markeder = new Marked(config)
    this.fetcher = new Fetcher(config)
    this.type = new Type(config.theme)
    this.builder = new Builder({
      config,
      renderer: this.renderer,
    })
    this.processor = new Processor({
      config,
      markeder: this.markeder,
    })
    this.server = new Server(config.base, {
      listen: path.join('themes', config.theme),
      public: config.public_dir,
    })
    this.extend = new Extend(this, [
      'fs',
      'logger',
      'renderer',
      'config',
      'markeder',
      'server',
    ])
  }

  start(port) {
    this.server.action = ({ e, path, clients }) => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        console.log(this.type.get(path))
      })
    }
    this.server.start(port)
  }

  build() {
    this.fetcher.status = status => this.logger.info(status)

    this.extend.init()
      .then(() => this.extend.run('after_init', null))
      .then(() => this.fetcher.fetch())
      .then(data => this.extend.run('after_fetch', data))
      .then(data => this.processor.process(data))
      .then(data => this.extend.run('after_process', data))
      .then(data => this.builder.build({ data, helpers: this.extend.helpers }))
      .then(data => this.extend.run('after_generate', data))
      .catch(err => this.logger.error(new Error(err)))
  }
}

module.exports = Acyort
