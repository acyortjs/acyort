
// render html

var config = require('./config');
var fs = require('fs-extra');
var colors = require('colors');
var swig = require('swig');

module.exports = function(path, template, data) {

    data.site = {
        menu: config.menu,
        title: config.title,
        subtitle: config.subtitle,
        description: config.description,
        year: new Date().getFullYear(),
        root: config.root,
        rss: config.root +'/'+ config.rss
    }

    if (!template) {
        return
    }

    //fs.outputFileSync(process.cwd() +'/'+ config.public_dir + path, mustache.render(template, data))

}
