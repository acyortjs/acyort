
// generate index pages

var yaml = require('yamljs');
    template = require('./template.js'),
    render = require('./render.js');

var config = yaml.load('../config.yml');

module.exports = function(data, type, name) {

    var home = type +'/index.html';
    if (type == 'page') {
        home = 'index.html'
    }
    
    var path = type;

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

    config.per_page = type == 'archives' ? 50 : config.per_page;

    if (data.length > config.per_page) {

        var page = 1;
        for (var i = 0; i < data.length; i += config.per_page) {

            pager.posts = data.slice(i, i + config.per_page);

            pager.next = {css: '', url: '/'+ path +'/'+ (page + 1) +'/'}
            if (page != 1) {
                pager.prev = {css: '', url: '/'+ path +'/'+ (page - 1) +'/'}
            }
            if (page == 2) {
                pager.prev = {css: '', url: type == 'page' ? '/' : '/'+ path +'/'}
            }
            if (page == Math.ceil(data.length / config.per_page)) {
                pager.next = {css: 'hide', url: ''}
            }

            if (page == 1) {
                render(home, tpl, pager)
            } else {
                render(path +'/'+ page +'/index.html', tpl, pager)
            }

            page ++
        }
    } else {
        pager.posts = data;
        render(home, tpl, pager)
    }

}
