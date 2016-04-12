
var config = require('./lib/config');
var fetch = require('./lib/fetch');
var feed = require('./lib/feed');
var templates = require('./lib/template')();
var pager = require('./lib/pager');
var render = require('./lib/render');
var archives = require('./lib/archives');
var serialize = require('./lib/serialize');
var colors = require('colors');

fetch(function(data) {
    build(serialize(data))
})

function build(data) {

    // copy assets
    require('./lib/assets.js')()

    // rss
    feed(data.posts)

    console.log('Info: '.blue +'building html...')

    // pages
    data.pages.forEach(function(page) {
        render(page.path, templates.page, page)
    })
    
    // archives
    render('/archives/index.html', templates.archives, archives(data.posts))
    
    // all tags and all categories
    render('/tags/index.html', templates.tags, {lists: data.tags})
    render('/categories/index.html', templates.categories, {lists: data.categories})

    // posts
    data.posts.forEach(function(post) {
        render(post.path, templates.post, post)
    })

    pager(data.posts, 'index', templates)

    // tag
    data.tags.forEach(function(tag) {
        pager(tag.posts, 'tag/'+ tag.name, templates)
    })

    // category
    data.categories.forEach(function(category) {
        pager(category.posts, 'category/'+ category.name, templates)
    })

    console.log('Info: '.blue +'success built html')

}
