
// generate archives page tag

var config = require('./config.js');
var tpl = require('./tpl.js');
var render = require('./render.js');

module.exports = function(data, type) {

    var home = type == 'index' ? 'index.html' : type +'/index.html';
    
    var path = type == 'index' ? 'page' : type;

    var template = tpl(type);

    var pager = {
        prev: {css: 'hide', url: ''},
        next: {css: 'hide', url: ''}
    }

    if (data.length > config.per_page) {

        var page = 1;
        for (var i = 0; i < data.length; i += config.per_page) {

            pager.posts = data.slice(i, i + config.per_page);

            pager.next = {css: '', url: '/'+ path +'/'+ (page + 1) +'/'}
            if (page != 1) {
                pager.prev = {css: '', url: '/'+ path +'/'+ (page - 1) +'/'}
            }
            if (page == 2) {
                pager.prev = {css: '', url: type == 'index' ? '/' : '/'+ path +'/'}
            }
            if (page == Math.ceil(data.length / config.per_page)) {
                pager.next = {css: 'hide', url: ''}
            }

            if (page == 1) {
                render('/'+ home, template, pager)
            } else {
                render('/'+ path +'/'+ page +'/index.html', template, pager)
            }

            page ++
        }
    } else {
        pager.posts = data;
        render('/'+ home, template, pager)
    }

}
