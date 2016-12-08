const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs-extra')
const mime = require('mime')
const chokidar = require('chokidar')
const WS = require('ws').Server
const config = require('./config')()
const source = require('./source')
const index = require('./')
const { log } = require('./util')

function Server(port) {
    const server = http.createServer((req, res) => {
        let filePath = decodeURIComponent(path.join(process.cwd(), url.parse(req.url).pathname))

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

                if ((config.dev || process.env.NODE_ENV === 'dev') && mime.lookup(filePath) === 'text/html') {
                    res.write("<script>var ws=new WebSocket('ws://'+ location.host);ws.onmessage=function(e){location.reload()}</script>")
                }

                res.end()
            }
        })
    }).listen(port)

    if (config.dev || process.env.NODE_ENV === 'dev') {
        const WSserver = new WS({ server })
        const watcher = () => chokidar.watch(path.join(process.cwd(), 'themes', config.theme), { ignored: /(^|[/\\])\../, persistent: true })

        let wt = watcher()

        WSserver.on('connection', (ws) => {
            wt.on('all', (e, file) => {
                if (file.indexOf(`${config.theme}/source`) > -1) {
                    log.info(e, file)
                    source(true)
                    ws.send(JSON.stringify({ e, file }))
                }

                if (file.indexOf(`${config.theme}/layout`) > -1 && file.split('.')[1] === 'html') {
                    log.info(e, file)
                    index(true)
                    ws.send(JSON.stringify({ e, file }))
                }
            })

            ws.on('close', () => {
                wt.close()
                wt = watcher()
            })
        })
    }

    log.info(`Server running\n=> http://127.0.0.1:${port}/`, '\nCTRL + C to shutdown')
}

module.exports = Server
