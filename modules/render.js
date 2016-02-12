
// render html

var config = require('../config.js'),
    fs = require('fs'),
    mustache = require('mustache');

module.exports = function(file, template, data) {

    data.menu = config.menu;
    data.site_title = config.title;
    data.site_about = config.about;
    data.full_year = new Date().getFullYear();
    data.rss = config.rss;

    fs.writeFileSync(file, mustache.render(template, data), 'utf8')
    console.log('Success build '+ file)

}
