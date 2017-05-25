const config = require('./config/')
const Log = require('../util/log')
const isDev = process.env.NODE_ENV === 'dev'

class Acyort {
  constructor() {
    this.dev = isDev
    this.config = config
    this.log = new Log()
  }

  test() {
    this.log.error('???')
  }
}

var s = new Acyort()

s.test()

module.exports = Acyort
