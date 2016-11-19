
const fs = require('fs-extra')
const config = require('./config')()
const colors = require('colors')

module.exports = function() {

    try {
        fs.copySync(process.cwd() +'/themes/'+ config.theme +'/source', process.cwd() +'/'+ config.public_dir)
    } catch(e) {
        console.log('\u00D7'.red, e)
    }
        
    console.log('\u221A Finished coping static files'.green)

}
