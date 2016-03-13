
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

    console.log(posts.length)
    /*
    // pages
    posts.forEach(function(e, i) {
        if (e.title.indexOf('[') > -1 && e.title.indexOf(']') > -1) {
            pages = pages.concat(posts.splice(i, 1))
        }
    })

    // categories

    /*
    // labels
    article.forEach(function(post) {
        post.labels.forEach(function(label) {
            category.forEach(function(e, i) {
                if (e.name == label.name) {
                    e.posts.push(post)
                }
                return
            })
        })
    })
    */

    //build_html()

})

function build_html() {
    console.log('Building Html...')

    // tags pages
    category.forEach(function(label) {
        if (label.posts.length) {
            pager(label.posts, 'tags/'+ label.name, label.name)
        }
    })

    // posts
    article.forEach(function(post) {
        var time = post.created_at.split('T')[0].split('-');
        render(time[0] +'/'+ time[1] +'/'+ post.id +'.html', tpl('post'), post)
    })

    // rss
    feed(article)

    // page posts
    page.forEach(function(post) {
        var title = post.title.substr(1, post.title.indexOf(']') - 1),
            path = title +'/index.html';

        post.page_title = title;
        post.title = post.title.split(']')[1];

        render(path, tpl('page'), post)
    })

    // posts pages
    pager(article, 'page')

    // archives pages
    pager(article, 'archives')

}
