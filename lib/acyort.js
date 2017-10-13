const Logger = require('./logger')
const Fetcher = require('./fetcher')
const Processor = require('./processor')
const Generator = require('./generator')
const Extend = require('./extend')
const config = require('./config')

const Module = require('module')
const vm = require('vm')
const fs = require('fs-extra')
const pathFn = require('path')

class Acyort {
  constructor() {
    this.config = config
    this.logger = new Logger()
    this.extend = new Extend(this)
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

  init() {
    const scripts = this.config.scripts
      .map(script => pathFn.join(process.cwd(), 'scripts', script))
      .forEach(script => {
        this.loadPlugin(script)
      })

    this._fetcher.fetch()
    .then(data => this._processor.process(data))
    .then(data => {
      // this.extend._functions.after_process_data.forEach(fn => {
        // fn(data)
      // })

      const fns = this.extend._functions.after_process_data.map(f => f(data))

      console.log(data.paginations.page)

      Promise.all(fns)
      .then(() => console.log(data.posts))

      //return this._generator.generate(data)
    })
    .catch(err => this.logger.error(err))
  }
}

module.exports = Acyort
