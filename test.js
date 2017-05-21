const Log = require('./util/log')
const Request = require('./util/request')

class Test extends Request {
  constructor(...args) {
    super(...args)
  }
}

var s = new Test('LoeiFy', 'Recordum', { page: 1 })

console.log(s.fetch())
