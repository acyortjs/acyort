
const _path = require('path')
const _category = require('./category')
const _filter = require('./filter')
const _tag = require('./tag')
const _thumb = require('./thumb')
const _marked = require('./marked')
//const _archives = require('./archives')
//const _pager = require('./pager')

const config = require('../config')()

module.exports = function(issues) {

    let posts = []
    let pages = []
    let categories = []
    let tags = []
    let temp

    // pages and posts 
    temp = _filter(issues)
    pages = temp.pages
    posts = temp.posts

    posts = posts.map(post => {
        const id = post.id
        const created = post.created_at
        const updated = post.updated_at
        const categories = _category(post)
        const title = post.title
        const path = `/${config.post_dir}/${id}.html`
        const url = _path.join(config.root, path)
        const author = {
            name: post.user.login,
            avatar: post.user.avatar_url,
            url: post.user.html_url
        }
        const more = '<!-- more -->'

        let content = post.body
        let tags
        let thumb
        let raw
        let summary = ''

        // tags
        temp = _tag(content)
        content = temp.content
        tags = temp.tags

        // thumb
        temp = _thumb(content)
        content = temp.content
        thumb = temp.thumb

        // content
        if (content.indexOf(more) > -1) {
            summary = content.split(more)[0]
            content = content.replace(more, '')
        }
        summary = _marked(summary)
        raw = _marked(content, true)
        content = _marked(content)
        
        return { id, created, updated, categories, title, path, url, author, tags, thumb, summary, raw, content }
    })

    posts.forEach((post, i) => {
        // prev and next
        post.prev = i > 0 ? posts[i - 1].id : ''
        post.next = i < posts.length - 1 ? posts[i + 1].id : ''

        // categories
        post.categories.forEach(category => {
            const index = categories.map(category => category.name).indexOf(category.name)

            if (index > -1) {
                return categories[index].posts.push(post.id)
            }
            
            categories.push({
                name: category.name,
                url: category.url,
                posts: [post.id]
            })
        })

        // tags
        post.tags.forEach(tag => {
            const index = tags.map(tag => tag.name).indexOf(tag.name)

            if (index > -1) {
                return tags[index].posts.push(post.id)
            }

            tags.push({
                name: tag.name,
                url: tag.url,
                posts: [post.id]
            })
        })
    })

    return Promise.resolve(categories)

    /*
    var posts = [];
    var categories = [];
    var tags = [];
    var pages = [];
    var archives = [];

    // pages posts filter
    var pages_issues = _filter(issues);
    pages = pages_issues.pages;
    issues = pages_issues.issues;

    async.map(issues, function(issue, callback) {
        var categories = _category(issue);

        // path
        var path = function() {
            var t = issue.created_at.split('T')[0].split('-');
            var url = '';

            switch (config.permalink) {
                default:
                case 'id':
                    url = '/posts/'+ issue.id +'.html'
                break;

                case 'time':
                    url = '/'+ t[0] +'/'+ t[1] +'/'+ issue.id +'.html'
                break;

                case 'category':
                    url = '/'+ config.category_dir.format() +'/'+ categories[0].name.format() +'/'+ issue.id +'.html'
                break;
            }

            return url
        }();

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
            categories: categories,
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

    }, function(err, posts) {

        posts.forEach(function(post, i) {
            // prev and next post
            post.prev = i > 0 ? posts[i - 1].id : '';
            post.next = i < posts.length - 1 ? posts[i + 1].id : '';

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
    */

}
