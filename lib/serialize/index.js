
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

    // all categories
    categories = posts.map(function(post) {
        return post.categories.map(function(category) {
        })
    })
    






    // tags posts
    tags = _unique(tags).map(function(tag) {
        return {
            name: tag,
            url: config.root +'/tag/'+ tag.replace(/\s/g, '_') +'/', 
            posts: []
        }
    })

    tags.forEach(function(tag) {
        tag.posts = posts.filter(function(post) {
            return post.tags.map(function(tag) {
                    return tag.name
                }).indexOf(tag.name) > -1
        })
        tag.number = tag.posts.length
    })

    // categories posts
    categories = _unique(categories).map(function(category) {
        return {
            name: category,
            url: config.root +'/category/'+ category.replace(/\s/g, '_') +'/',
            posts: []
        }
    })

    categories.forEach(function(category) {
        category.posts = posts.filter(function(post) {
            return post.categories.map(function(category) {
                    return category.name
                }).indexOf(category.name) > -1
        })
        category.number = category.posts.length
    })

    // [posts, pages, all categories, all tags]
    return {
        posts: posts,
        pages: pages,
        categories: categories,
        tags: tags
    }

}
