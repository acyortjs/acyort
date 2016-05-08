
// copy assets

var fs = require('fs-extra');
var config = require('./config');

module.exports = function() {

    fs.copySync(process.cwd() +'/themes/'+ config.theme +'/source', process.cwd() +'/'+ config.public_dir)
        
    console.log('INFO: '.blue +'success copied assets')

}
