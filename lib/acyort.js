const config = require('./config/')
const Logger = require('./logger/')
const Fetcher = require('./fetcher/')
const markeder = require('./markeder/')
const Processor = require('./processor/')
const Render = require('./render/')

const Server = require('./server/')

class Acyort {
  constructor() {
    this.config = config
    this.logger = new Logger()
    this.fetcher = new Fetcher(this)
    this.markeder = markeder
    this.processor = new Processor(this)
    this.render = new Render(this)
  }

  _() {
    this.fetcher._()
    .then(data => this.processor._(data))
    .then(data => this.render._(data))
    .catch(err => console.log(err))
  }
}

var s = new Acyort()

// var s = new Server(2222)

s._()

module.exports = Acyort
