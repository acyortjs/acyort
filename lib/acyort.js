
var config = require('./config');
var fetch = require('./fetch');
var feed = require('./feed');
var pager = require('./pager');
var render = require('./render');
var archives = require('./archives');
var serialize = require('./serialize');
var templates = require('./template')();
var colors = require('colors');

module.exports = function() {

    if (config.dev) {

        build(serialize(require('../test/issues.json')))

    } else {

        fetch(function(data) {
            build(serialize(data))
        })

    }


    function build(data) {

        data.config = config;

        /*
        // copy assets
        require('./assets.js')()

        // rss
        feed(data.posts)

        console.log('Info: '.blue +'building html...')

        // page posts
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

        // post pagination
        pager(data.posts, 'index', templates, data)

        // tag pagination
        data.tags.forEach(function(tag) {
            pager(tag.posts, 'tag/'+ tag.name, templates, data)
        })

        // category pagination
        data.categories.forEach(function(category) {
            pager(category.posts, 'category/'+ category.name, templates, data)
        })

        console.log('Info: '.blue +'success built html')
        */

    }

}
