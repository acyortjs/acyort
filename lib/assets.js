
// copy assets

var fs = require('fs-extra');
var config = require('./config.js');

module.exports = function() {

    fs.copy(process.cwd() +'/themes/'+ config.theme +'/source', process.cwd() +'/public', function (err) {
        if (err) {
            return console.error(err)
        }
        console.log('success copied assets')
    })

}
