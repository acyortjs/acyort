
// generate rss

var config = require('./config.js');
var fs = require('fs-extra');
var rss = require('rss');

module.exports = function(posts) {

    var feed = new rss({
        title: config.title,
        description: config.description,
        feed_url: config.url +'/'+ config.rss,
        site_url: config.url,
        cdata: true,
        pubDate: new Date().toISOString()
    })

    posts.forEach(function(post) {
        feed.item({
            title: post.title,
            url: config.url + post.path,
            author: post.author.name,
            date: post.update,
            description: post.body
        })
    })

    fs.outputFile(process.cwd() + config.public_dir +'/'+ config.rss, feed.xml(), function(err) {
        if (err) {
            return console.err(err)
        }
        console.log('success build '+ config.rss)
    })

}
