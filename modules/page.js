
// page data handing

var config = require('../config.js'),
    marked = require('marked'),
    timeFormat = require('./modules/time.js'),
    hl = require('highlight.js');

module.exports = function(data) {

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
            return hl.highlightAuto(code).value
        }
    })
    
    data.forEach(function(e) {
        var title = e.title.substr(1, e.title.indexOf(']') - 1),
            path = title +'/index.html';

        e.body = marked(e.body);
        e.site_title = config.title;
        e.path_title = title;
        e.title = e.title.split(']')[1];
        e.site_about = config.about;
        e.menu = config.menu;
        e.rss = config.rss;
        e.full_year = new Date().getFullYear(); 
    })

    return data

}
