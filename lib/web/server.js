const http = require('http')
const url = require('url')
const pathFn = require('path')
const fs = require('fs-extra')
const mime = require('mime')
const config = require('../config/')

class Server {
  constructor(port) {
    this.config = config
    this.port = port
  }

  getPath(req) {
    const path = pathFn.join(process.cwd(), this.config.public_dir, url.parse(req.url).pathname)
    return decodeURIComponent(path)
  }

  inject(path) {
    if (
      this.config.dev   ||
      this.config.json  ||
      mime.lookup(path) !== 'text/html'
    ) {
      return ''
    }

    return fs.readFileSync(pathFn.join(__dirname, 'inject.html'), 'utf8')
  }

  checkPath(path) {
    if (fs.statSync(path).isDirectory()) {
      return pathFn.join(path, 'index.html')
    }
    return path
  }

  errPage(res, err) {
    res.writeHead(err ? 500 : 404, { 'Content-Type': 'text/plain' })
    res.write(err ? err : '404 Not Found')
    res.end()
  }

  _() {
    return http.createServer((req, res) => {
      const path = this.checkPath(this.getPath(req))

      if (!path)
        return errPage(res)
      }

      return fs.readFile(path, 'binary', (err, file) => {
        if (err) {
          return errPage(res, err)
        }

        res.writeHead(200, { 'Content-Type': mime.lookup(path) })
        res.write(file, 'binary')
        res.write(this.inject(path))
        res.end()

        return true
      })
    }).listen(this.port)
  }
}
