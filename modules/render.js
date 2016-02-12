
// render html

var fs = require('fs'),
    mustache = require('mustache');

module.exports = function(file, template, data) {

    fs.writeFileSync(file, mustache.render(template, data), 'utf8')
    console.log('Success build '+ file)

}
