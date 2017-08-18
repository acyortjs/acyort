const Logger = require('./logger')
const Fetcher = require('./fetcher')
const Processor = require('./processor')
const Generator = require('./generator')

class Acyort {
  constructor() {
    this._logger = new Logger()
    this._fetcher = new Fetcher()
    this._processor = new Processor()
    this._generator = new Generator()
  }

  start() {
    this._fetcher.fetch()
    .then(data => this._processor.process(data))
    .then(data => this._generator.generate(data))
    .catch(err => this._logger.error(err))
  }
}

module.exports = Acyort
