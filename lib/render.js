
// render html

var config = require('./config.js');
var fs = require('fs-extra');
var mustache = require('mustache');

module.exports = function(path, template, data) {

    data.menu = config.menu;
    data.title = config.title;
    data.description = config.description;
    data.year = new Date().getFullYear();
    data.rss = '/'+ config.rss;

    if (config.duoshuo) {
        data.comment = {
            name: config.duoshuo,
            url: '//static.duoshuo.com/embed.js'
        }
    }
    if (config.disqus) {
        data.comment = {
            name: config.disqus,
            url: '//' + config.disqus + '.disqus.com/embed.js'
        }
    }

    fs.outputFile(process.cwd() +'/'+ config.public_dir + path, mustache.render(template, data), function(err) {
        if (err) {
            return console.error(err)
        }
        console.log('success build '+ path)
    })

}
