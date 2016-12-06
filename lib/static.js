const fs = require('fs-extra')
const config = require('./config')()
const path = require('path')

module.exports = function static(liveReload) {
    try {
        fs.copySync(path.join(process.cwd(), 'themes', config.theme, 'source'), path.join(process.cwd(), config.public_dir))
    } catch(e) {
        console.log('\u00D7'.red, e)
    }
    
    if (!liveReload) {
        console.log('\u221A Finished coping static files'.green)
    }
}
