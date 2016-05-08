
// data serialize

var _authors = require('./authors');
var _category = require('./category');
var _tag = require('./tag');
var _thumb = require('./thumb');
var _content = require('./content');
var _page = require('./page');
var _archives = require('./archives');
var _pager = require('./pager.js');
var config = require('../config');

module.exports = function(issues) {

    var posts = [];
    var categories = [];
    var tags = [];
    var pages = [];
    var archives = [];

    // authors filter
    issues = _authors(issues)

    // page posts filter
    var _p = _page(issues);
    pages = _p.pages;
    issues = _p.issues;

    // all posts
    posts = issues.map(function(issue) {

        // categories
        var categories = _category(issue);

        // tags
        var _t = _tag(issue.body);
        var tags = _t.tags;

        issue.body = _t.body;

        // thumb
        var _s = _thumb(issue.body);
        var thumb = _s.thumb;

        issue.body = _s.body;

        // content
        var _c = _content(issue.body);
        var summary = _c.summary;
        var body = _c.body;

        // url and path
        var t = issue.created_at.split('T')[0].split('-');
        var path = '/'+ t[0] +'/'+ t[1] +'/'+ issue.id +'.html';

        return {

            id:         issue.id,
            created:    issue.created_at,
            updated:    issue.updated_at,
            categories: categories,
            tags:       tags,
            thumb:      thumb,
            summary:    summary,
            body:       body,
            title:      issue.title,
            path:       path,
            url:        config.root + path,
            author: {
                name:   issue.user.login,
                avatar: issue.user.avatar_url,
                url:    issue.user.html_url
            }

        }

    })

    posts.forEach(function(post, i) {

        // prev and next post
        var prev = '';
        var next = '';

        if (i > 0) {
            prev = posts[i - 1].id
        }

        if (i < posts.length - 1) {
            next = posts[i + 1].id
        }

        post.prev = prev;
        post.next = next;

        // all categories
        post.categories.forEach(function(category) {
            var _categories = categories.map(function(_category) {
                return _category.name
            })

            var index = _categories.indexOf(category.name);

            if (index > -1) {
                categories[index].posts.push(post.id)
            } else {
                categories.push({
                    name: category.name,
                    url: category.url,
                    posts: [post.id]
                })
            }
        })

        // all tags
        post.tags.forEach(function(tag) {
            var _tags = tags.map(function(_tag) {
                return _tag.name
            })

            var index = _tags.indexOf(tag.name);

            if (index > -1) {
                tags[index].posts.push(post.id)
            } else {
                tags.push({
                    name: tag.name,
                    url: tag.url,
                    posts: [post.id]
                })
            }
        })

    })

    // archives
    archives = _archives(posts)

    // pagination
    var pager = {
        tags: {},
        categories: {}
    }

    pager.index = _pager(posts.map(function(post) {
        return post.id
    }), 'index')

    tags.forEach(function(tag) {
        pager.tags[tag.name] = _pager(tag.posts, 'tag/'+ tag.name)
    })

    categories.forEach(function(category) {
        pager.categories[category.name] = _pager(category.posts, 'category/'+ category.name)
    })

    return {
        config: config,
        posts: posts,
        pages: pages,
        categories: categories,
        tags: tags,
        archives: archives,
        pager: pager
    }

}
