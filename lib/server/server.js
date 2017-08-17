const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs-extra')
const mime = require('mime')
const config = require('../config')

function errPage(res, err) {
  res.writeHead(err ? 500 : 404, { 'Content-Type': 'text/plain' })
  res.write(err || '404 Not Found')
  res.end()
}

class Server {
  constructor() {
    this._config = config
  }

  _path(req) {
    const { public_dir } = this._config
    const { pathname } = url.parse(req.url)
    return decodeURIComponent(path.join(process.cwd(), public_dir, pathname))
  }

  _inject(filePath) {
    const { dev, json } = this._config

    if (!dev || json || mime.lookup(filePath) !== 'text/html') {
      return ''
    }
    return fs.readFileSync(path.join(__dirname, 'inject.html'), 'utf8')
  }

  createServer(port) {
    return http.createServer((req, res) => {
      let reqPath = this._path(req)

      if (!fs.existsSync(reqPath)) {
        return errPage(res)
      }

      if (fs.statSync(reqPath).isDirectory()) {
        reqPath = path.join(reqPath, 'index.html')
      }

      if (!fs.existsSync(reqPath)) {
        return errPage(res)
      }

      return fs.readFile(reqPath, 'binary', (err, file) => {
        if (err) {
          return errPage(res, err)
        }

        res.writeHead(200, {
          'Content-Type': mime.lookup(reqPath),
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'Expires': '-1',
          'Pragma': 'no-cache',
        })
        res.write(file, 'binary')
        res.write(this._inject(reqPath))
        res.end()

        return
      })
    }).listen(port)
  }
}

module.exports = Server
