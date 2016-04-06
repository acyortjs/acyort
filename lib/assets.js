
// copy assets

var fs = require('fs-extra');
var config = require('./config');

module.exports = function() {

    fs.copy(process.cwd() +'/themes/'+ config.theme +'/source', process.cwd() +'/'+ config.public_dir, function (err) {
        if (err) {
            return console.error(err)
        }
        console.log('success copied assets')
    })

}
