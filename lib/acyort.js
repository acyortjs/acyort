const config = require('./config/')
const Logger = require('./logger/')
const Fetcher = require('./fetcher/')
const markeder = require('./markeder/')
// const Processor = require('./processor/')
// const Renderer = require('./renderer/')

class Acyort {
  constructor() {
    this.dev = process.env.NODE_ENV === 'dev' || config.dev
    this.config = config
    this.logger = new Logger()
    this.fetcher = new Fetcher(this)
    this.markeder = markeder
    // this.processor = new Processor(this)
    // this.renderer = new Renderer(this.config)
  }

  test() {
    // console.log(this.markeder('### _这是什么-'))
    // this.fetcher.fetch()
    // .then((data) => {
    //   console.log(data.length)
    //   this.serializer.serialize(data)
    // })
    // .catch(err => console.log(err))
    // this.logger.success('???')
    // console.log(this.renderer.templates)
  }
}

var s = new Acyort()

s.test()

module.exports = Acyort
