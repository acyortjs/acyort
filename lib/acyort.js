const config = require('./config/')
const Log = require('../util/log')
const Renderer = require('./renderer')
const isDev = process.env.NODE_ENV === 'dev'

class Acyort {
  constructor() {
    this.dev = isDev
    this.config = config
    this.log = new Log()
    this.renderer = new Renderer(this.config)
  }

  test() {
    // this.log.error('???')
    console.log(this.renderer.templates)
  }
}

var s = new Acyort()

s.test()

module.exports = Acyort
