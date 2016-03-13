
// generate rss

var config = require('./config.js');
var marked = require('marked');
var fs = require('fs-extra');
var mustache = require('mustache');
var rss = require('rss');

module.exports = function(data) {

    config.url = config.url[config.url.length - 1] == '/' ? config.url.substr(0, config.url.length - 1) : config.url;

    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
            return
        }
    })

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
            author: e.user.login,
            date: e.post_time,
            description: marked(e.body)
        })
    })

    fs.outputFile(process.cwd() +'/'+ config.public_dir +'/'+ config.rss, feed.xml(), function(err) {
        if (err) {
            return console.err(err)
        }
        console.log('Success build '+ config.rss)
    })

}
