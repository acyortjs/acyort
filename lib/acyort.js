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
    const watches = [
      pathFn.join(themeDir, source_dir),
      pathFn.join(themeDir, layout_dir),
      pathFn.join(themeDir, i18n_dir),
    ]
    const publics = pathFn.join(base, public_dir)
    const methods = [
      'fs',
      'logger',
      'renderer',
      'config',
      'markeder',
      'helper',
      'version',
      'server',
      'builder',
    ]
    const tags = [
      'index',
      'categories',
      'category',
      'page',
      'post',
      'tag',
      'tags',
    ]

    this.fs = fs
    this.tags = tags
    this.posts = []
    this.version = version
    this.config = config
    this.logger = new Logger()
    this.renderer = new Render()
    this.markeder = new Marked(this.config)
    this.fetcher = new Fetcher(this.config)
    this.processor = new Processor(this.config)
    this.helper = new Helper(this)
    this.server = new Server({ watches, publics })
    this.builder = new Builder(this)
    this.extend = new Extend(this, methods)

    this.fetchData = null
    this.processData = null
  }

  start(port) {
    this.server.trigger = ({ path, clients }) => {
      const type = getType(this.config, this.tags, path)
      if (type) {
        this.build(type).then(() => {
          const msg = type === 'css' ? 'css' : 'html'
          clients.forEach(client => client.send(msg))
        })
      }
    }
    this.build().then(() => this.server.start(port))
  }

  build(type) {
    this.fetcher.status = status => this.logger.info(status)

    return this.extend.init()
      .then(() => {
        const { helpers } = this.extend
        Object.keys(helpers).forEach(h => this.helper.addMethod(h, helpers[h]))
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
      .then((data) => {
        data.posts.forEach(post => this.posts.push(post))
        return Promise.resolve(data)
      })
      .then(data => this.extend.run('after_process', data))
      .then(data => this.builder.build({ data, type }))
      .then(data => this.extend.run('after_build', data))
      .catch(err => this.logger.error(err))
  }
}

module.exports = Acyort
