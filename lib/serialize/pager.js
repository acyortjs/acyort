
// category, tag, index pages

var config = require('../config');
var _paginator = require('./paginator');
var _archives = require('./archives');

require('./format')()

module.exports = function(posts, type, _posts) {

    var home = (type == 'index' ? 'index.html' : type +'/index.html').format();
    var path = (type == 'index' ? 'page' : type).format();
    var heading = type.split('/')[1] || config.title;
    var per_page = config.per_page;

    if (type == 'archives') {
        per_page = config.archives_per_page;
        heading = 'Archives';
    }

    var pagers = [];

    if (posts.length > per_page) {

        var page = 1;

        for (var i = 0; i < posts.length; i += per_page) {

            var pager = {
                heading: heading,
                prev: '',
                next: ''
            }

            pager.posts = posts.slice(i, i + per_page);

            if (page != 1) {
                pager.prev = config.root +'/'+ path +'/'+ (page - 1) +'/';
            }
            if (page == 2) {
                pager.prev = type == 'index' ? config.root +'/' : config.root +'/'+ path +'/';
            }

            pager.next = config.root +'/'+ path +'/'+ (page + 1) +'/';
            if (page == Math.ceil(posts.length / per_page)) {
                pager.next = ''
            }

            pager.paginator = _paginator(config.root +'/'+ path +'/', page, Math.ceil(posts.length / per_page))

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
            paginator: '',
            posts: posts,
            path: '/'+ home
        }

        pagers.push(pager)

    }

    if (type == 'archives') {
        pagers.forEach(function(pager) {
            var posts = _posts.filter(function(post) {
                return pager.posts.indexOf(post.id) > -1
            })
            pager.posts = _archives(posts)
        })
    }

    return pagers

}
