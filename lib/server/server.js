const http = require('http')
const url = require('url')
const pathFn = require('path')
const fs = require('fs-extra')
const mime = require('mime')

class Server {
  constructor(config) {
    this.config = config
  }

  getPath(req) {
    const path = pathFn.join(process.cwd(), this.config.public_dir, url.parse(req.url).pathname)
    return decodeURIComponent(path)
  }

  inject(path) {
    if (
      !this.config.dev ||
      this.config.json ||
      mime.lookup(path) !== 'text/html'
    ) {
      return ''
    }

    return fs.readFileSync(pathFn.join(__dirname, 'inject.html'), 'utf8')
  }

  errPage(res, err) {
    res.writeHead(err ? 500 : 404, { 'Content-Type': 'text/plain' })
    res.write(err ? err : '404 Not Found')
    res.end()
  }

  createServer(port) {
    return http.createServer((req, res) => {
      let path = this.getPath(req)

      if (!fs.existsSync(path)) {
        return this.errPage(res)
      }

      if (fs.statSync(path).isDirectory()) {
        path = pathFn.join(path, 'index.html')
      }

      if (!fs.existsSync(path)) {
        return this.errPage(res)
      }

      return fs.readFile(path, 'binary', (err, file) => {
        if (err) {
          return this.errPage(res, err)
        }

        res.writeHead(200, {
          'Content-Type': mime.lookup(path),
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          Expires: '-1',
          Pragma: 'no-cache',
        })
        res.write(file, 'binary')
        res.write(this.inject(path))
        res.end()

        return true
      })
    }).listen(port)
  }
}

module.exports = Server
