
// generate rss

var config = require('./config.js');
var fs = require('fs-extra');
var rss = require('rss');

module.exports = function(data) {

    var feed = new rss({
        title: config.title,
        description: config.description,
        feed_url: config.url +'/'+ config.rss,
        site_url: config.url,
        cdata: true,
        pubDate: new Date().toISOString()
    })

    data.forEach(function(e) {
        feed.item({
            title: e.title,
            url: config.url + e.path,
            author: e.author.name,
            date: e.updated_time,
            description: e.body
        })
    })

    fs.outputFile(process.cwd() +'/public/'+ config.rss, feed.xml(), function(err) {
        if (err) {
            return console.err(err)
        }
        console.log('success build '+ config.rss)
    })

}
