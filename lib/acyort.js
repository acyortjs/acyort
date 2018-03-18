const fs = require('fs-extra')
const path = require('path')
const { version } = require('../package.json')
const Logger = require('acyort-logger')
const Fetcher = require('acyort-fetcher')
const Marked = require('acyort-marked')
const processor = require('acyort-processor')
const Extend = require('acyort-extend')
const Render = require('acyort-render')
const Server = require('acyort-server')
const Helper = require('acyort-helper')
const Builder = require('./builder')
const Events = require('./events')
const Template = require('./template')
const Filter = require('./filter')

class Acyort {
  constructor(config) {
    const {
      base,
      theme,
      public_dir: publicDir,
      source_dir: sourceDir,
      layout_dir: layoutDir,
      i18n_dir: i18nDir,
    } = config
    const themeDir = path.join(base, 'themes', theme)
    const watches = [
      path.join(themeDir, sourceDir),
      path.join(themeDir, layoutDir),
      path.join(themeDir, i18nDir),
    ]
    const publics = path.join(base, publicDir)
    const methods = [
      'fs',
      'logger',
      'renderer',
      'config',
      'marker',
      'helper',
      'version',
      'server',
      'builder',
      'template',
      'fetcher',
      'filter',
    ]

    this.fs = fs
    this.data = { posts: [], pages: [], categories: [], tags: [] }
    this.version = version
    this.config = config
    this.logger = new Logger()
    this.renderer = new Render()
    this.template = new Template()
    this.filter = new Filter()
    this.marker = new Marked(this.config)
    this.fetcher = new Fetcher(this.config)
    this.processor = processor.bind(this.config)
    this.helper = new Helper(this)
    this.server = new Server({ watches, publics })
    this.events = new Events(this)
    this.builder = new Builder(this)
    this.extend = new Extend(this, methods)

    this.fetcher.status = status => this.logger.info(status, 'fetcher')
    this.server.trigger = (params) => {
      const { path: current, clients } = params
      const event = this.events.check(current)

      if (!event) {
        return
      }

      this.filter.reset()
      this.helper.reset()

      this.build(event)
        .then(() => {
          const msg = event === 'css' ? 'css' : 'html'
          clients.forEach(client => client.send(msg))
        })
    }
  }

  start(port) {
    return this.build()
      .then(() => {
        this.server.start(port)
        return Promise.resolve()
      })
  }

  run(type, data) {
    const scripts = this.filter.scripts[type]
    return Promise.all(scripts.map(script => script(data))).then(() => data)
  }

  setData(data) {
    data.posts.forEach(post => this.data.posts.push(post))
    data.pages.forEach(page => this.data.pages.push(page))
    data.categories.forEach(category => this.data.categories.push(category))
    data.tags.forEach(tag => this.data.tags.push(tag))
    return Promise.resolve(data)
  }

  build(event) {
    return this.extend.init()
      .then(() => this.run('after_init', null))
      .then(() => this.fetcher.fetch())
      .then(data => this.run('after_fetch', data))
      .then(data => this.processor(data))
      .then(data => this.setData(data))
      .then(data => this.run('after_process', data))
      .then(data => this.builder.build({ data, event }))
      .then(data => this.run('after_build', data))
      .catch(err => this.logger.error(err))
  }
}

module.exports = Acyort
