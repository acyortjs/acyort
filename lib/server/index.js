const fs = require('fs-extra')
const pathFn = require('path')
const chokidar = require('chokidar')
const WS = require('ws').Server
const config = require('../config')()
const source = require('../source')
const acyort = require('../')
const server = require('./server')
const inject = fs.readFileSync('./injected.html', 'utf8')
const { log } = require('../util')

function Index(port) {
    if (!config.dev && process.env.NODE_ENV !== 'dev') {
        return server().listen(port)
    }

    const staticServer = server(inject).listen(port)
    const WSserver = new WS({ staticServer })
    const watchPath = pathFn.join(process.cwd(), 'themes', config.theme)
    const watcherFn = () => chokidar.watch(watchPath, {
        ignored: path => /(^[.#]|(?:__|~)$)/.test(pathFn.basename(path)),
        ignoreInitial: true
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
                index(true)
                ws.send(JSON.stringify({ e, file }))
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
