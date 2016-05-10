
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

        build(serialize(require('../test/_.json')))

    } else {

        fetch(function(data) {
            build(serialize(data))
        })

    }

    function build(data) {

        // helper function
        var helper = {
            time: function(time, format) {
                return moment(time).format(format)
            },
            post: function(id) {
                return data.posts.filter(function(post) {
                    return post.id == id
                })[0]
            }
        }

        // copy assets
        require('./assets.js')()

        // rss
        feed(data.posts)

        // page posts
        data.pages.forEach(function(page) {
            render(page.path, templates.page, {page: page, helper: helper, data: data})
        })

        // archives
        render('/archives/index.html', templates.archives, {archives: data.archives, helper: helper, data: data})

        // posts
        data.posts.forEach(function(post) {
            render(post.path, templates.post, {post: post, helper: helper, data: data})
        })

        // categories
        render('/categories/index.html', templates.categories, {categories: data.categories, helper: helper, data: data})

        // tags
        render('/tags/index.html', templates.tags, {tags: data.tags, helper: helper, data: data})

        // index
        data.pager.index.forEach(function(index) {
            render(index.path, templates.index, {index: index, helper: helper, data: data})
        })

        // category
        for (var category in data.pager.categories) {
            data.pager.categories[category].forEach(function(category) {
                render(category.path, templates.category, {category: category, helper: helper, data: data})
            })
        }

        // tag
        for (var tag in data.pager.tags) {
            data.pager.tags[tag].forEach(function(tag) {
                render(tag.path, templates.tag, {tag: tag, helper: helper, data: data})
            })
        }

        console.log('INFO: '.blue +'success built html')

    }

}
