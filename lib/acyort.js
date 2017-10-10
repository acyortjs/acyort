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
    this.name = 'acyort'
    this._logger = new Logger()
    this._fetcher = new Fetcher()
    this._processor = new Processor()
    this._generator = new Generator()
  }

  // https://github.com/hexojs/hexo/blob/master/lib/hexo/index.js#L206
  loadPlugin(path) {
    const moduleFn = new Module(path)
    const requireFn = p => moduleFn.require(p)
    const file = fs.readFileSync(path)
    const script = `(function(exports, require, module, __filename, __dirname, acyort) {${file}})`
    const fn = vm.runInThisContext(script, path)

    moduleFn.filename = path
    moduleFn.paths = Module._nodeModulePaths(path)

    requireFn.resolve = request => Module._resolveFilename(request, moduleFn)
    requireFn.main = process.mainModule
    requireFn.extensions = Module._extensions
    requireFn.cache = Module._cache

    const runTime = fn(moduleFn.exports, requireFn, moduleFn, path, pathFn.dirname(path), this)

    return Promise.resolve(runTime)
  }

  start() {

    const path = pathFn.join(process.cwd(), 'test.js')

    this.loadPlugin(path).then(res => console.log(res))

    // this._fetcher.fetch()
    // .then(data => this._processor.process(data))
    // .then(data => this._generator.generate(data))
    // .catch(err => this._logger.error(err))
  }
}

module.exports = Acyort
