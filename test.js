// const Log = require('./util/log')
// const Request = require('./util/request')
// const config = require('./lib/config/')
// const Acyort = require('./lib/acyort')

//console.log(s.fetch())

// class Test extends Acyort {
//   constructor() {
//     super()
//   }

//   log() {
//     console.log(this.config)
//   }
// }

const I18n = require('acyort-i18n')
const pathFn = require('path')
const yaml = require('yamljs')

class Test extends I18n {
  constructor() {
    const i18n = {}
    super({
      locales: ['en'],
      register: i18n,
      directory: pathFn.join(process.cwd(), 'assets/themes/ccc45', 'i18n'),
      extension: '.yml',
      parse: data => yaml.parse(data.toString('utf-8')),
    })
    this.i18n = i18n
  }

  log() {
    console.log(this.i18n)
  }
}

var s = new Test()

s.log()
