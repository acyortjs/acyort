const pathFn = require('path')
const chokidar = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./server')
const Events = require('./events')
const config = require('../config/')
const Logger = require('../logger/')
const Source = require('../source/')
const Fetcher = require('../fetcher/')
const markeder = require('../markeder/')
const Processor = require('../processor/')
const Render = require('../render/')

class Ws extends StaticServer {
  constructor(port) {
    super(config)

    this.config = config
    this.logger = new Logger()
    this.markeder = markeder
    this.fetcher = new Fetcher(this)
    this.processor = new Processor(this)
    this.render = new Render(this)
    this.source = new Source(this)
    this.events = new Events(config.theme)

    this.port = port
    this.clients = []
    this.server = null
    this.ws = null
    this.watcher = null
    this.data = null
  }

  get live() {
    return this.config.dev && !this.config.json
  }

  log() {
    const livereload = this.live ? '(LiveReload)' : ''
    const info = `Server running${livereload}\n=> http://127.0.0.1:${this.port}/`
    this.logger.info(info, '\nCTRL + C to shutdown')
  }

  initWatcher() {
    this.watcher = chokidar.watch(this.watchDir, {
      ignored: /(^|[/\\])\../,
      ignoreInitial: true,
    })
  }

  initWs() {
    this.ws = new Server({ server: this.server })
  }

  get watchDir() {
    return pathFn.join(process.cwd(), 'themes', this.config.theme)
  }

  reBuild(type) {
    if (this.data) {
      return this.render.toBuild(this.data, type)
    }

    return this.fetcher._()
    .then(data => this.processor._(data))
    .then((data) => {
      this.data = data
      this.render.toBuild(data, type)
    })
  }

  _() {
    this.log()
    this.server = this.createServer(this.port)

    if (!this.live) {
      return this.server
    }

    this.initWatcher()
    this.initWs()

    this.ws.on('connection', (client) => {
      client.on('close', () => {
        this.clients = this.clients.filter(c => c !== client)
      })
      this.clients.push(client)
    })

    this.watcher.on('all', (e, file) => {
      const event = this.events._(file)

      if (file.indexOf(`${config.theme}/`) > -1) {
        this.logger.info(e, file)
      }

      if (event === 'css') {
        this.source._()
        return this.clientEvent('css')
      }

      if (event === 'static') {
        this.source._()
        return this.clientEvent('reload')
      }

      if (event === 'yml' || event === 'html') {
        return this.reBuild('all')
        .then(() => this.clientEvent('reload'))
      }

      if (event !== 'unknow') {
        return this.reBuild(event)
        .then(() => this.clientEvent('reload'))
      }

      return false
    })

    return this.ws
  }

  clientEvent(event) {
    this.clients.forEach((client) => {
      if (event === 'css') {
        client.send('css')
      } else {
        client.send('reload')
      }
    })
  }
}

module.exports = Ws
