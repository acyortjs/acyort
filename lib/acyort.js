
var config = require('./config');
var fetch = require('./fetch');
var feed = require('./feed');
var templates = require('./template')();
var pager = require('./pager');
var render = require('./render');
var archives = require('./archives');
var serialize = require('./serialize');
var colors = require('colors');

module.exports = function() {

    fetch(function(data) {
        build(serialize(data))
    })

    function build(data) {
        // copy assets
        require('./assets.js')()

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
}
