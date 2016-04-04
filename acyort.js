
var config = require('./lib/config');
var fetch = require('./lib/fetch');
var feed = require('./lib/feed');
var tpl = require('./lib/template');
var pager = require('./lib/pager');
var render = require('./lib/render');
var archives = require('./lib/archives');
var serialize = require('./lib/serialize');

fetch(function(data) {
    build(serialize(data))
})

function build(data) {

    // copy assets
    require('./lib/assets.js')()
    /*
    console.log('building...')

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

    // tag
    tags.forEach(function(tag) {
        pager(tag.posts, 'tag/'+ tag.name)

        // tags
        tag.number = tag.posts.length;
    })

    // category
    categories.forEach(function(category) {
        pager(category.posts, 'category/'+ category.name)

        // categories
        category.number = category.posts.length
    })

    // archives
    render('/archives/index.html', tpl('archives'), archives(posts))

    // render tags and categories
    var all_tags = { data: tags };
    var all_categories = { data: categories };
    render('/tags/index.html', tpl('tags'), all_tags)
    render('/categories/index.html', tpl('categories'), all_categories)
    */

}
