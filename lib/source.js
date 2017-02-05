const fs = require('fs-extra')
const pathFn = require('path')
const { log } = require('./util')
const configFn = require('./config')

function Source() {
    const config = global.config || configFn()
    const sourceDir = pathFn.join(process.cwd(), 'themes', config.theme, 'source')

    try {
        fs.copySync(sourceDir, pathFn.join(process.cwd(), config.public_dir))
    } catch (e) {
        log.error(e)
    }

    if (!global.live) {
        log.done('Finished coping static files')
    }
}

module.exports = Source
