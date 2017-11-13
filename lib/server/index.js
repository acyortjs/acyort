const path = require('path')
const chokidar = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./server')
const Events = require('./events')
const getConfig = require('../config')
const Logger = require('../logger')
const Fetcher = require('../fetcher')
const Processor = require('../processor')
const Generator = require('../generator')

class Ws extends StaticServer {
  constructor() {
    const config = getConfig()
    super(config)

    this._config = config
    this._logger = new Logger()
    this._fetcher = new Fetcher(this)
    this._processor = new Processor(this)
    this._generator = new Generator(this)
    this._events = new Events(config)

    this._clients = []
    this._port = undefined
    this._server = null
    this._ws = null
    this._watcher = null
    this._data = null
  }

  get _isLive() {
    return this._config.dev && !this._config.json
  }

  get _dir() {
    return path.join(process.cwd(), 'themes', this._config.theme)
  }

  _info() {
    const livereload = this._isLive ? '(LiveReload)' : ''
    const info = `Server running${livereload}\n=> http://127.0.0.1:${this._port}/`
    this._logger.info(info, '\nCTRL + C to shutdown')
  }

  _initServer() {
    this._server = this.createServer(this._port)
  }

  _initWatcher() {
    this._watcher = chokidar.watch(this._dir, {
      ignored: /(^|[/\\])\../,
      ignoreInitial: true,
    })
  }

  _initWs() {
    this._ws = new Server({ server: this._server })
  }

  _sendEvent(event) {
    this._clients.forEach((client) => {
      if (event === 'css') {
        client.send('css')
      } else {
        client.send('reload')
      }
    })
  }

  _refresh(type) {
    if (this._data) {
      return this._generator.genHtmls(this._data, type)
    }

    return this._fetcher.fetch()
    .then(data => this._processor.process(data))
    .then((data) => {
      this._data = data
      return this._generator.genHtmls(data, type)
    })
  }

  init(port) {
    this._port = port
    this._info()
    this._initServer()

    if (!this._isLive) {
      return
    }

    // create the liveReload
    this._initWatcher()
    this._initWs()

    // clients list
    this._ws.on('connection', (client) => {
      client.on('close', () => {
        this._clients = this._clients.filter(c => c !== client)
      })
      this._clients.push(client)
    })

    // watch files change
    this._watcher.on('all', (e, file) => {
      const event = this._events.get(file)

      if (file.indexOf(`${this._config.theme}/`) > -1) {
        this._logger.info(e, file)
      }

      if (event === 'css') {
        this._generator.copySources()
        return this._sendEvent('css')
      }
      if (event === 'static') {
        this._generator.copySources()
        return this._sendEvent('reload')
      }
      if (event === 'yml' || event === 'html') {
        return this._refresh('all')
        .then(() => this._sendEvent('reload'))
      }
      if (event !== 'unknow') {
        return this._refresh(event)
        .then(() => this._sendEvent('reload'))
      }

      return event
    })
  }
}

module.exports = Ws
