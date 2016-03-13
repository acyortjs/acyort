
// copy assets

var fs = require('fs-extra');
var config = require('./config.js');

module.exports = function() {

    fs.copy(process.cwd() +'/themes/source', process.cwd() +'/'+ config.public_dir, function (err) {
        if (err) {
            return console.error(err)
        }
        console.log('success copied assets to "'+ config.public_dir +'"')
    })

}()
