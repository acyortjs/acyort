
// category, tag, index pages

var config = require('../config');

require('./totrim')()

module.exports = function(posts, type) {

    var home = (type == 'index' ? 'index.html' : type +'/index.html').totrim();
    var path = (type == 'index' ? 'page' : type).totrim();
    var heading = type.split('/')[1] || config.title;

    var pagers = [];

    if (posts.length > config.per_page) {

        var page = 1;

        for (var i = 0; i < posts.length; i += config.per_page) {

            var pager = {
                heading: heading,
                prev: '',
                next: ''
            }

            pager.posts = posts.slice(i, i + config.per_page);

            if (page != 1) {
                pager.prev = config.root +'/'+ path +'/'+ (page - 1) +'/';
            }
            if (page == 2) {
                pager.prev = type == 'index' ? config.root +'/' : config.root +'/'+ path +'/';
            }

            pager.next = config.root +'/'+ path +'/'+ (page + 1) +'/';
            if (page == Math.ceil(posts.length / config.per_page)) {
                pager.next = ''
            }

            if (page == 1) {

                pager.path = '/'+ home;
                pagers.push(pager)

            } else {
                
                pager.path = '/'+ path +'/'+ page +'/index.html';
                pagers.push(pager)

            }

            page ++
        }

    } else {

        var pager = {
            heading: heading,
            prev: '',
            next: '',
            posts: posts,
            path: '/'+ home
        }

        pagers.push(pager)

    }

    return pagers

}
