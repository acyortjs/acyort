
var config = require('./lib/config.js');
var fetch = require('./lib/fetch.js');
var serialize = require('./lib/serialize.js');
var feed = require('./lib/feed.js');
var tpl = require('./lib/tpl.js');
var pager = require('./lib/pager.js');
var render = require('./lib/render.js');

var categories = [], posts = [], pages = [], tags = [];

fetch(function(data) {
    // data serialize
    data = serialize(data);

    // posts
    posts = data.posts;

    // pages
    pages = data.pages;

    // categories
    data.categories.forEach(function(e, i) {
        categories[i] = {};
        categories[i].name = e;
        categories[i].posts = [];
    })

    // tags
    data.tags.forEach(function(e, i) {
        tags[i] = {};
        tags[i].name = e;
        tags[i].posts = [];
    })

    posts.forEach(function(post) {
        post.categories.forEach(function(category) {
            categories.forEach(function(e, i) {
                if (e.name == category) {
                    e.posts.push(post)
                }
                return
            })
        })
        post.tags.forEach(function(tag) {
            tags.forEach(function(e, i) {
                if (e.name == tag) {
                    e.posts.push(post)
                }
                return
            })
        })
    })

    build_html()
})

function build_html() {
    console.log('building html...')

    // rss
    feed(posts)

    // posts
    posts.forEach(function(post) {
        render(post.path, tpl('post'), post)
    })
    // posts pages
    pager(posts, 'index')

    // pages
    pages.forEach(function(page) {
        render(page.path, tpl('page'), page)
    })

    /*
    // tags pages
    category.forEach(function(label) {
        if (label.posts.length) {
            pager(label.posts, 'tags/'+ label.name, label.name)
        }
    })

    // archives pages
    pager(article, 'archives')
    */

}
