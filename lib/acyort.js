const config = require('./config/')
const isDev = process.env.NODE_ENV === 'dconfigev'

class Acyort {
  constructor() {
    this.dev = isDev
    this.config = config
  }
}

module.exports = Acyort
