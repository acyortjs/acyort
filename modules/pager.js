
// generate index pages

var config = require('../config.js');
    timeFormat = require('time.js'),

module.exports = function(data) {

    /*
    data.forEach(function(e) {
        var time = e.created_at.split('T')[0].split('-');
        e.path = '/post/'+ time[0] +'/'+ time[1] +'/'+ e.id +'.html';
        e.updated_time = timeFormat(e.updated_at.split('T')[0]);
    })
    */

    function obj() {
        return {
            site_title: config.title,
            site_about: config.about,
            full_year:  new Date().getFullYear(),
            menu:       config.menu,
            rss:        config.rss,
            prev:       '',
            next:       ''
        }
    }

    var e;

    if (data.length > config.perpage) {
        for (var i = 0; i < data.length; i += config.perpage) {
            e = obj();
            e.posts = data.slice(i, i + config.perpage);
        }
    } else {
        e = obj();
        e.posts = data
    }

}
