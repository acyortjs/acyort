
// data serialize

var _authors = require('./authors');
var _category = require('./category');
var _tag = require('./tag');
var _thumb = require('./thumb');
var _content = require('./content');
var _page = require('./page');
var _unique = require('./unique');
var config = require('../config');

module.exports = function(issues) {

    var posts = [];
    var categories = [];
    var tags = [];
    var pages = [];

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

    posts.forEach(function(post) {

        // all categories
        post.categories.forEach(function(category) {
            var _categories = categories.map(function(_category) {
                return _category.name
            })

            var index = _categories.indexOf(category.name);

            if (index > -1) {
                categories[index].number = categories[index].number + 1;
                categories[index].posts.push(post.id)
            } else {
                categories.push({
                    name: category.name,
                    url: category.url,
                    number: 1,
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
                tags[index].number = tags[index].number + 1;
                tags[index].posts.push(post.id)
            } else {
                tags.push({
                    name: tag.name,
                    url: tag.url,
                    number: 1,
                    posts: [post.id]
                })
            }
        })

    })

    return {
        posts: posts,
        pages: pages,
        categories: categories,
        tags: tags
    }

}
