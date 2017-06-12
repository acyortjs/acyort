const config = require('./config/')
const Logger = require('./logger/')
const Fetcher = require('./fetcher/')
const markeder = require('./markeder/')
const Processor = require('./processor/')
// const Renderer = require('./renderer/')

class Acyort {
  constructor() {
    this.dev = process.env.NODE_ENV === 'dev' || config.dev
    this.config = config
    this.logger = new Logger()
    this.fetcher = new Fetcher(this)
    this.markeder = markeder
    this.processor = new Processor(this)
    // this.renderer = new Renderer(config)
  }

  test() {
    this.fetcher._()
    .then(data => this.processor._(data))
    .then(data => console.log(data))
    .catch(err => console.log(err))
  }
}

var s = new Acyort()

s.test()

module.exports = Acyort
