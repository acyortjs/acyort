const Logger = require('./logger')
const Fetcher = require('./fetcher')
const Processor = require('./processor')
const Generator = require('./generator')

const Module = require('module')
const vm = require('vm')
const fs = require('fs-extra')
const pathFn = require('path')

class Acyort {
  constructor() {
    this._logger = new Logger()
    this._fetcher = new Fetcher()
    this._processor = new Processor()
    this._generator = new Generator()
  }

  start() {

    const path = pathFn.join(process.cwd(), 'test.js')
    const module = new Module()

    let script = fs.readFileSync(path)

    script = `(function(acyort) { ${script} })`

    vm.runInThisContext(script)(this)

    // this._fetcher.fetch()
    // .then(data => this._processor.process(data))
    // .then(data => this._generator.generate(data))
    // .catch(err => this._logger.error(err))
  }
}

module.exports = Acyort
