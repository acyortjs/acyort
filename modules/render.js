
// render html

var config = require('../config.js'),
    fs = require('fs'),
    mustache = require('mustache');

module.exports = function(path, template, data) {

    data.menu = config.menu;
    data.site_title = config.title;
    data.site_about = config.about;
    data.full_year = new Date().getFullYear();
    data.rss = config.rss;

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

    fs.writeFileSync(path, mustache.render(template, data), 'utf8')
    console.log('Success build '+ path)

}
