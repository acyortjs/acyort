
const fs = require('fs-extra')
const config = require('./config')()

module.exports = function(path, data) {
    if (!template) {
        return
    }
    fs.outputFileSync(process.cwd() +'/'+ config.public_dir + path, template(data))
}
