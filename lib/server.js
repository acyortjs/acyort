
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs-extra')
const mime = require('mime')
const colors = require('colors')
const chokidar = require('chokidar')
const ws = require('ws').Server
const config = require('./config')()

module.exports = function(port) {

    const server = http.createServer((req, res) => {

        let filePath = decodeURIComponent(path.join(process.cwd(), url.parse(req.url).pathname))

        const page404 = () => {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.write('404 Not Found')
            res.end()
        }

        const page500 = () => {
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

        fs.readFile(filePath, 'binary', (err, file) => {        
            if (err) {        
                return page500()
            }

            response.writeHead(200, {'Content-Type': mime.lookup(filePath)})
            response.write(file, 'binary')

            if ((config.dev || process.env.NODE_ENV == 'dev') && mime.lookup(filePath) == 'text/html') {
                response.write("<script>var ws=new WebSocket('ws://'+ location.host);ws.onmessage=function(e){location.reload()}</script>")
            }

            response.end()

        })

    }).listen(port)

    const wsServer = new ws({ server })
    const watcher = () => chokidar.watch(process.cwd() +'/themes/'+ config.theme, { ignored: /[\/\\]\./, persistent: true })

    let wt = watcher()

    wsServer.on('connection', (ws) => {
        wt.on('all', (e, path) => {
            if (path.indexOf('/'+ config.theme +'/source/') > -1) {
                // static 
                require('./assets')()
            } else {
                // layout
                require('./acyort')(true)
            }

            ws.send(JSON.stringify({ e, path }))
        })

        ws.on('close', () => {
            wt.close()
            wt = watcher()
        })
    })

    console.log('\u221A Server running'.green +'\n=> http://127.0.0.1:'+ port +'/\nCTRL + C to shutdown')

}
