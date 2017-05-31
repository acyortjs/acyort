const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs-extra')
const mime = require('mime')
const config = require('../config/')

function server(port, inject) {
  const server = http.createServer((req, res) => {
    let filePath = path.join(process.cwd(), config.public_dir, url.parse(req.url).pathname)
    filePath = decodeURIComponent(filePath)

    const page404 = () => {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.write('404 Not Found')
      res.end()
    }

    const page500 = (err) => {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.write(err)
      res.end()
    }

    if (!fs.existsSync(filePath)) {
      return page404()
    }

    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }

    if (!fs.existsSync(filePath)) {
      return page404()
    }

    return fs.readFile(filePath, 'binary', (err, file) => {
      if (err) {
        page500(err)
      } else {
        res.writeHead(200, { 'Content-Type': mime.lookup(filePath) })
        res.write(file, 'binary')
        if (inject && mime.lookup(filePath) === 'text/html') {
          res.write(inject)
        }
        res.end()
      }
    })
  }).listen(port)

  return server
}

module.exports = server
