
// render html

var fs = require('fs-extra');
var swig = require('swig');
var config = require('./config');

module.exports = function(path, template, data) {

    if (!template) {
        return
    }

    fs.outputFileSync(
        process.cwd() +'/'+ config.public_dir + path, 
        swig.render(template, {locals: data})
    )

}
