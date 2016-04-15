
// generate archives page tag

var config = require('./config');
var render = require('./render');

module.exports = function(data, type, templates, all) {

    var home = type == 'index' ? 'index.html' : type +'/index.html';
    var path = type == 'index' ? 'page' : type;
    var tpl = templates[type.split('/')[0]];

    var pager = {
        total: all.posts.length,
        prev: '',
        next: '',
        name: type.split('/')[1] || '',
        tags: all.tags.map(function(tag) {
            return {
                name: tag.name,
                url: tag.url,
                number: tag.number
            }
        }),
        categories: all.categories.map(function(category) {
            return {
                name: category.name,
                url: category.url,
                number: category.number
            }
        })
    }

    if (data.length > config.per_page) {

        var page = 1;

        for (var i = 0; i < data.length; i += config.per_page) {

            // posts data
            pager.posts = data.slice(i, i + config.per_page);

            // pagination url
            if (page != 1) {
                pager.prev = config.root +'/'+ path +'/'+ (page - 1) +'/';
            }
            if (page == 2) {
                pager.prev = type == 'index' ? config.root +'/' : config.root +'/'+ path +'/';
            }

            pager.next = config.root +'/'+ path +'/'+ (page + 1) +'/';
            if (page == Math.ceil(data.length / config.per_page)) {
                pager.next = ''
            }

            // render
            if (page == 1) {
                render('/'+ home, tpl, pager)
            } else {
                render('/'+ path +'/'+ page +'/index.html', tpl, pager)
            }

            page ++
        }

    } else {
        pager.posts = data;
        render('/'+ home, tpl, pager)
    }

}
