const config = require('./config/')
const Logger = require('./logger/')
const Fetcher = require('./fetcher/')
const markeder = require('./markeder/')
const Processor = require('./processor/')
const Render = require('./render/')
const Source = require('./source/')
const Rss = require('./rss/')

const Server = require('./server/')

class Acyort {
  constructor() {
    this.config = config
    this.logger = new Logger()
    this.fetcher = new Fetcher(this)
    this.markeder = markeder
    this.processor = new Processor(this)
    this.render = new Render(this)
    this.rss = new Rss(this)
    this.source = new Source(this)
  }

  _() {
    this.fetcher._()
    .then(data => this.processor._(data))
    .then((data) => {
      this.render._(data)
      this.rss._(data.posts)
      this.source._()
    })
    .catch(err => this.logger.error(err))
  }
}

var s = new Acyort()

// var s = new Server(2222)

s._()

module.exports = Acyort
