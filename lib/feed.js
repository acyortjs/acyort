
// generate rss

var config = require('./config');
var fs = require('fs-extra');
var rss = require('rss');
var colors = require('colors');

module.exports = function(posts) {

    var feed = new rss({
        title: config.title,
        description: config.description || '',
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
            date: post.updated,
            description: post.body
        })
    })

    fs.outputFileSync(process.cwd() +'/'+ config.public_dir +'/'+ config.rss, feed.xml())

    console.log('Info: '.blue +'success build ['+ config.rss +']')

}
