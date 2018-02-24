const fs = require('fs-extra')
const pathFn = require('path')
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
      'marker',
      'helper',
      'version',
      'server',
      'builder',
    ]
    const templates = [
      'index',
      'categories',
      'category',
      'page',
      'post',
      'tag',
      'tags',
    ]

    this.fs = fs
    this.templates = templates
    this.data = { posts: [], pages: [], categories: [], tags: [] }
    this.version = version
    this.config = config
    this.logger = new Logger()
    this.renderer = new Render()
    this.marker = new Marked(this.config)
    this.fetcher = new Fetcher(this.config)
    this.processor = processor.bind(this.config)
    this.helper = new Helper(this)
    this.server = new Server({ watches, publics })
    this.builder = new Builder(this)
    this.extend = new Extend(this, methods)
    this.fetcher.status = status => this.logger.info(status, 'fetcher')
  }

  start(port) {
    this.server.trigger = ({ path, clients }) => {
      const type = getType.call(this.config, this.templates, path)
      if (type) {
        this.build(type).then(() => {
          const msg = type === 'css' ? 'css' : 'html'
          clients.forEach(client => client.send(msg))
        })
      }
    }
    this.build().then(() => this.server.start(port))
  }

  setData(data) {
    data.posts.forEach(post => this.data.posts.push(post))
    data.pages.forEach(page => this.data.pages.push(page))
    data.categories.forEach(category => this.data.categories.push(category))
    data.tags.forEach(tag => this.data.tags.push(tag))
    return Promise.resolve(data)
  }

  build(type) {
    return this.extend.init()
      .then(() => this.extend.run('after_init', null))
      .then(() => this.fetcher.fetch())
      .then(data => this.extend.run('after_fetch', data))
      .then(data => this.processor(data))
      .then(data => this.setData(data))
      .then(data => this.extend.run('after_process', data))
      .then(data => this.builder.build({ data, type }))
      .then(data => this.extend.run('after_build', data))
      .catch(err => this.logger.error(err))
  }
}

module.exports = Acyort
