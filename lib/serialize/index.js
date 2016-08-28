
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
var config = require('../config');

require('./format')();

var async = require("async");
var probe = require('probe-image-size');
var fs = require('fs-extra');

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

    // get cache
    var thumb_cache = {};
    try {
        thumb_cache = fs.readJsonSync(process.cwd() +'/.cache/thumb.json', {throws: false})
    } catch(e) {}

    thumb_cache = thumb_cache || {};

    async.map(issues, function(issue, callback) {

        // path
        var path = function(time, id) {
            var t = time.split('T')[0].split('-');
            return '/'+ t[0] +'/'+ t[1] +'/'+ id +'.html';
        }(issue.created_at, issue.id);

        // tags
        var tags_body = _tag(issue.body);
        issue.body = tags_body.body;

        // thumb
        var thumb_body = _thumb(issue.body);
        issue.body = thumb_body.body;

        // content
        var content = _content(issue.body);

        // post item
        var item = {
            id:         issue.id,
            created:    issue.created_at,
            updated:    issue.updated_at,
            categories: _category(issue),
            tags:       tags_body.tags,
            thumb:      thumb_body.thumb,
            toc:        _toc(content.body),
            summary:    content.summary,
            body:       content.body,
            raw:        content.raw,
            title:      issue.title,
            path:       path,
            url:        config.root + path,
            author: {
                name:   issue.user.login,
                avatar: issue.user.avatar_url,
                url:    issue.user.html_url
            }
        };

        if (config.thumbnail_size && item.thumb) {

            // from cache
            if (thumb_cache[item.id] && thumb_cache[item.id].src == item.thumb) {

                item.thumb = thumb_cache[item.id];

                console.log('INFO: '.blue +'[from cache] '+ item.thumb.src +': '+ item.thumb.width +'x'+ item.thumb.height)

                callback(null, item)

            } else {

                // thumb size
                probe(item.thumb, function(err, result) {

                    if (err) {
                        return console.log('x '.red + err)
                    }

                    item.thumb = {
                        src: item.thumb,
                        width: result.width,
                        height: result.height
                    };

                    thumb_cache[item.id] = item.thumb;

                    console.log('INFO: '.blue + item.thumb.src +': '+ item.thumb.width +'x'+ item.thumb.height)

                    callback(null, item)

                })

            }

        } else {
            callback(null, item)
        }

    }, function(err, posts) {

        // save to cache
        fs.outputFileSync(process.cwd() +'/.cache/thumb.json', JSON.stringify(thumb_cache))

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
