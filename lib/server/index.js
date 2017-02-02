const fs = require('fs-extra')
const pathFn = require('path')
const chokidar = require('chokidar')
const WS = require('ws').Server
const source = require('../source')
const acyort = require('../')
const server = require('./server')
const { log } = require('../util')
const config = require('../config')()

function Index(port) {
    if (!config.dev && process.env.NODE_ENV !== 'dev' && !config.json) {
        return server(port)
    }

    global.live = true

    const inject = fs.readFileSync(pathFn.join(__dirname, 'inject.html'), 'utf8')
    const staticServer = server(port, inject)
    const WSserver = new WS({ server: staticServer })
    const watchPath = pathFn.join(process.cwd(), 'themes', config.theme)
    const watcher = chokidar.watch(watchPath, {
        ignored: path => /(^[.#]|(?:__|~)$)/.test(pathFn.basename(path)),
        ignoreInitial: true,
    })

    let clients = []

    watcher.on('all', (e, file) => {
        if (file.indexOf(`${config.theme}/`) > -1) {
            log.info(e, file)
        }

        clients.forEach((client) => {
            if (file.indexOf(`${config.theme}/source`) > -1) {
                source()
                if (pathFn.extname(file) === '.css') {
                    client.send('css')
                } else {
                    client.send('reload')
                }
            }

            if (file.indexOf(`${config.theme}/layout`) > -1 && pathFn.extname(file) === '.html') {
                acyort().then(() => client.send('reload'))
            }
        })
    })

    WSserver.on('connection', (ws) => {
        ws.on('close', () => {
            clients = clients.filter(client => client !== ws)
        })
        clients.push(ws)
    })

    return log.info(`Server running\n=> http://127.0.0.1:${port}/`, '\nCTRL + C to shutdown')
}

module.exports = Index
