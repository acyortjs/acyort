
// post data handing

var config = require('../config.js'),
    marked = require('marked'),
    timeFormat = require('time.js'),
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
        var time = e.created_at.split('T')[0].split('-');

        e.summary = e.body.indexOf('<!-- more -->') > -1 ? e.body.split('<!-- more -->')[0] : ''; 
        e.body = e.body.replace('<!-- more -->', '');
        e.marked_body = marked(e.body);
        e.rss = config.rss;
        e.full_year = new Date().getFullYear();
        e.site_about = config.about;
        e.site_title = config.title;
        e.updated_time = timeFormat(e.updated_at.split('T')[0]);
        e.menu = config.menu;
        e.path = '/posts/'+ time[0] +'/'+ time[1] +'/'+ e.id +'.html';
    })

    return data

}
