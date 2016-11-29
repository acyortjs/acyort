const fs = require('fs-extra')
const config = require('./config')()
const colors = require('colors')
const path = require('path')

module.exports = function() {
    try {
        fs.copySync(path.join(process.cwd(), 'themes', config.theme, 'source'), path.join(process.cwd(), config.public_dir))
    } catch(e) {
        console.log('\u00D7'.red, e)
    }
        
    console.log('\u221A Finished coping static files'.green)
}
