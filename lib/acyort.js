const Logger = require('./logger')
const Fetcher = require('./fetcher')
const markeder = require('./markeder')
const Processor = require('./processor')
const Render = require('./render')

class Acyort {
  constructor() {
    this._logger = new Logger()
    this._fetcher = new Fetcher()
    this._markeder = markeder
    this._processor = new Processor()
    this._render = new Render()
  }

  start() {
    this._fetcher.fetch()
    .then(data => this._processor.process(data))
    .then(data => this._render.generate(data))
    .catch(err => this._logger.error(err))
  }
}

module.exports = Acyort
