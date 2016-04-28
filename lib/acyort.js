
var config = require('./config');
var fetch = require('./fetch');
var feed = require('./feed');
var render = require('./render');
var serialize = require('./serialize');
var templates = require('./template')();

var colors = require('colors');
var moment = require('moment');

module.exports = function() {

    if (config.dev) {

        build(serialize(require('../test/issues.json')))

    } else {

        fetch(function(data) {
            build(serialize(data))
        })

    }


    function build(data) {

        var helper = {
            time: function(time, format) {
                return moment(time).format(format)
            },
            post: function(id) {
                return data.posts[id]
            }
        }

        // page posts
        /*
        data.pages.forEach(function(page) {
            render(page.path, templates.page, {page: page, helper: helper, data: data})
        })
        */        

        // archives
        //render('/archives/index.html', templates.archives, {archives: data.archives, helper: helper, data: data})

        // posts
        /*
        for (var id in data.posts) {
            render(data.posts[id].path, templates.post, {post: data.posts[id], helper})
        }
        */

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
