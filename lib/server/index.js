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

    const inject = fs.readFileSync(pathFn.join(__dirname, 'inject.html'), 'utf8')
    const staticServer = server(port, inject)
    const WSserver = new WS({ server: staticServer })
    const watchPath = pathFn.join(process.cwd(), 'themes', config.theme)
    const watcherFn = () => chokidar.watch(watchPath, {
        ignored: path => /(^[.#]|(?:__|~)$)/.test(pathFn.basename(path)),
        ignoreInitial: true,
    })

    let watcher = watcherFn()

    WSserver.on('connection', (ws) => {
        watcher.on('all', (e, file) => {
            if (file.indexOf(`${config.theme}/source`) > -1) {
                log.info(e, file)
                source(true)
                ws.send(JSON.stringify({ e, file }))
            }

            if (file.indexOf(`${config.theme}/layout`) > -1 && file.split('.')[1] === 'html') {
                log.info(e, file)
                acyort(true).then(() => ws.send(JSON.stringify({ e, file })))
            }
        })

        ws.on('close', () => {
            watcher.close()
            watcher = watcherFn()
        })
    })

    return log.info(`Server running\n=> http://127.0.0.1:${port}/`, '\nCTRL + C to shutdown')
}

module.exports = Index
