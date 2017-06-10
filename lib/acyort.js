const config = require('./config/')
const Logger = require('./logger/')
const Fetcher = require('./fetcher/')
// const Renderer = require('./renderer/')

class Acyort {
  constructor() {
    this.dev = process.env.NODE_ENV === 'dev' || config.dev
    this.config = config
    this.logger = new Logger()
    this.fetcher = new Fetcher(this)
    // this.renderer = new Renderer(this.config)
  }

  test() {
    this.fetcher.fetch()
    .then(data => console.log(data))
    .catch(err => console.log(err))
    // this.logger.success('???')
    // console.log(this.renderer.templates)
  }
}

var s = new Acyort()

s.test()

module.exports = Acyort
