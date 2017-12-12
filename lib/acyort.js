const fs = require('fs-extra')
const Logger = require('acyort-logger')
const Fetcher = require('acyort-fetcher')
const Marked = require('acyort-marked')
const Processor = require('acyort-processor')
const Extend = require('acyort-extend')
const Render = require('acyort-render')
const Generator = require('./generator')

class Acyort {
  constructor(config) {
    this.fs = fs
    this.config = config
    this.logger = new Logger()
    this.renderer = new Render()
    this.generator = new Generator({ config, renderer: this.renderer })
    this.markeder = new Marked(this.config)
    this.processor = new Processor({ config: this.config, markeder: this.markeder })
    this.fetcher = new Fetcher(config)
    this.extend = new Extend(this, ['fs', 'logger', 'renderer', 'config', 'markeder'])
  }

  run() {
    this.fetcher.status = status => this.logger.info(status)

    this.extend.init()
      .then(() => this.extend.run('after_init', null))
      .then(() => this.fetcher.fetch())
      .then(data => this.extend.run('after_fetch', data))
      .then(data => this.processor.process(data))
      .then(data => this.extend.run('after_process', data))
      .then(data => this.generator.generate(data, this.extend.helpers))
      .then(data => this.extend.run('after_generate', data))
      .catch(err => this.logger.error(new Error(err)))
  }
}

module.exports = Acyort
