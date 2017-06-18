const fs = require('fs-extra')
const pathFn = require('path')
const chokidar = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./server')
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

  currentEvent(file) {
    const { theme } = this.config
    const source = `${theme}/source`
    const layout = `${theme}/layout`
    const i18n = `${theme}/i18n`

    if (file.indexOf(source) > -1) {
      if (this.fileExt(file) === '.css') {
        return 'css'
      }
      return 'static'
    }

    if (file.indexOf(layout) > -1 && this.fileExt(file) === '.html') {
      return 'html'
    }

    if (file.indexOf(i18n) > -1 && this.fileExt(file) === '.yml') {
      return 'yml'
    }

    return 'unknow'
  }

  fileExt(file) {
    return pathFn.extname(file)
  }

  reBuild() {
    if (this.data) {
      return this.render._(this.data)
    } else {
      return this.fetcher._()
      .then(data => this.processor._(data))
      .then((data) => {
        this.data = data
        this.render._(data)
      })
    }
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
      const event = this.currentEvent(file)

      if (file.indexOf(`${config.theme}/`) > -1) {
        this.logger.info(e, file)
      }

      this.clients.forEach((client) => {
        if (event === 'css') {
            this.source._()
            client.send('css')
        } else {
          this.reBuild()
          .then(() => client.send('reload'))
        }
      })
    })

    return this.ws
  }
}

module.exports = Ws
