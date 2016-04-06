
// render html

var config = require('./config');
var fs = require('fs-extra');
var mustache = require('mustache');

module.exports = function(path, template, data) {

    data.site = {
        menu: config.menu,
        title: config.title,
        subtitle: config.subtitle,
        description: config.description,
        year: new Date().getFullYear(),
        url: config.url, 
        rss: config.url +'/'+ config.rss
    }

    if (config.duoshuo) {
        data.site.comment = {
            name: config.duoshuo,
            url: '//static.duoshuo.com/embed.js'
        }
    }
    if (config.disqus) {
        data.site.comment = {
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
