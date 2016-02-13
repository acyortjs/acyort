
// generate index pages

var config = require('../config.js');
    timeFormat = require('./time.js'),
    template = require('./template.js'),
    dir = require('./dir.js'),
    render = require('./render.js');

module.exports = function(data, type, name) {

    var home = './'+ type +'/index.html';
    if (type == 'pages') {
        home = './index.html'
    }
    
    var path = './'+ type;

    var tpl = template.index;
    if (type == 'archives') {
        tpl = template.archives
    }
    if (type.indexOf('tags') > -1) {
        tpl = template.tag
    }

    var pager = {
        prev: {css: 'hide', url: ''},
        next: {css: 'hide', url: ''}
    }
    if (type.indexOf('tags') > -1) {
        pager.name = name
    }

    config.perpage = type == 'archives' ? 50 : config.perpage;

    if (data.length > config.perpage) {
        dir(path)
        
        var page = 1;
        for (var i = 0; i < data.length; i += config.perpage) {

            pager.posts = data.slice(i, i + config.perpage);

            pager.next = {css: '', url: path.split('.')[1] +'/'+ (page + 1) +'/'}
            if (page != 1) {
                pager.prev = {css: '', url: path.split('.')[1] +'/'+ (page - 1) +'/'}
            }
            if (page == 2) {
                pager.prev = {css: '', url: type == 'pages' ? '/' : path.split('.')[1] +'/'}
            }
            if (page == Math.ceil(data.length / config.perpage)) {
                pager.next = {css: 'hide', url: ''}
            }

            if (page == 1) {
                render(home, tpl, pager)
            } else {
                dir(path +'/'+ page)
                render(path +'/'+ page +'/index.html', tpl, pager)
            }

            page ++
        }
    } else {
        if (type != 'pages') {
            dir(path)
        }

        pager.posts = data;
        render(home, tpl, pager)
    }

}
