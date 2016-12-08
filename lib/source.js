const fs = require('fs-extra')
const config = require('./config')()
const path = require('path')
const { log } = require('./util')

function Source(liveReload) {
    try {
        fs.copySync(path.join(process.cwd(), 'themes', config.theme, 'source'), path.join(process.cwd(), config.public_dir))
    } catch (e) {
        log.error(e)
    }

    if (!liveReload) {
        log.done('Finished coping static files')
    }
}

module.exports = Source
