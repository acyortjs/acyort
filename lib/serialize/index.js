
// data serialize

var _authors = require('./authors');
var _category = require('./category');
var _tag = require('./tag');
var _thumb = require('./thumb');
var _content = require('./content');
var _page = require('./page');
var _archives = require('./archives');
var _pager = require('./pager.js');
var _toc = require('./toc');
var _customs = require('./customs');
var config = require('../config');

require('./format')();

var async = require("async");
var probe = require('probe-image-size');

module.exports = function(issues, callback) {

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

    async.map(issues, function(issue, callback) {

        // categories
        var categories = _category(issue);

        // tags
        var tags = _tag(issue.body);

        // thumb
        var _s = _thumb(issue.body);
        var thumb = _s.thumb;

        issue.body = _s.body;

        // custom fields
        var customs = _customs(issue.body);

        // content
        var _c = _content(issue.body);
        var summary = _c.summary;
        var body = _c.body;

        // url and path
        var t = issue.created_at.split('T')[0].split('-');
        var path = '/'+ t[0] +'/'+ t[1] +'/'+ issue.id +'.html';

        // thumb size
        probe(config.thumbnail_size ? thumb : '', function(err, result) {

            if (err && config.thumbnail_size) {
                return console.log(err)
            }

            if (!err) {
                thumb = {
                    src: thumb,
                    width: result.width,
                    height: result.height
                }
            }

            callback(null, {
                id:         issue.id,
                created:    issue.created_at,
                updated:    issue.updated_at,
                categories: categories,
                tags:       tags,
                thumb:      thumb,
                customs:    customs,
                toc:        _toc(body),
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
            })

        })

    }, function(err, posts) {

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

        // pagination
        var pager = {
            tags: {},
            categories: {}
        }

        pager.index = _pager(posts.map(function(post) {
            return post.id
        }), 'index')

        pager.archives = _pager(posts.map(function(post) {
            return post.id
        }), 'archives', posts)

        tags.forEach(function(tag) {
            pager.tags[tag.name] = _pager(tag.posts, config.tag_dir.format() +'/'+ tag.name)
        })

        categories.forEach(function(category) {
            pager.categories[category.name] = _pager(category.posts, config.category_dir.format() +'/'+ category.name)
        })

        // all data
        callback({
            config: config,
            posts: posts,
            pages: pages,
            categories: categories,
            tags: tags,
            pager: pager
        })

    })

}
