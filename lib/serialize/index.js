
// data serialize

var _authors = require('./authors');
var _category = require('./category');
var _tag = require('./tag');
var _thumb = require('./thumb');
var _time = require('./time');
var _content = require('./content');
var _page = require('./page');
var _unique = require('./unique');
var config = require('../config');

module.exports = function(data) {

    var posts = [];
    var categories = [];
    var tags = [];
    var pages = [];

    // authors filter
    data = _authors(data)

    data.forEach(function(e, i) {

        posts[i] = {};

        if (e.title.indexOf('[') > -1 && e.title.indexOf(']') > -1) {
            // page post
            posts[i].categories = [];
            posts[i].tags = [];
            posts[i].thumb = '';

        } else {

            // all categories and post categories
            categories = categories.concat(posts[i].categories = _category(e));

            // all tags and posts tags
            var tag_arr = _tag(e.body);

            tags = tags.concat(posts[i].tags = tag_arr[0]);
            e.body = tag_arr[1];

            // post thumb
            var thumb_arr = _thumb(e.body);

            posts[i].thumb = thumb_arr[0];
            e.body = thumb_arr[1];

        }

        // post time
        posts[i].time = _time(e.created_at);
        posts[i].update = e.updated_at;

        // post content
        var content_arr = _content(e.body);

        posts[i].summary = content_arr[0];
        posts[i].body = content_arr[1];

        // stuff
        posts[i].id = e.id;
        posts[i].title = e.title;
        posts[i].author = {
            name: e.user.login,
            avatar: e.user.avatar_url,
            url: e.user.html_url
        }

        posts[i].path = '/'+ posts[i].time.YYYY +'/'+ posts[i].time.MM +'/'+ e.id +'.html';
        posts[i].url = config.root +'/'+ posts[i].time.YYYY +'/'+ posts[i].time.MM +'/'+ e.id +'.html';

    })

    // page posts
    var page_post_arr = _page(posts);

    pages = page_post_arr[0];
    posts = page_post_arr[1];

    // tags posts
    tags = _unique(tags).map(function(tag) {
        return {
            name: tag,
            url: config.root +'/tag/'+ tag, 
            posts: []
        }
    })

    tags.forEach(function(tag) {
        tag.posts = posts.filter(function(post) {
            return post.tags.indexOf(tag.name) > -1
        })
        tag.number = tag.posts.length
    })

    // categories posts
    categories = _unique(categories).map(function(category) {
        return {
            name: category,
            url: config.root +'/category/'+ category, 
            posts: []
        }
    })

    categories.forEach(function(category) {
        category.posts = posts.filter(function(post) {
            return post.categories.indexOf(category.name) > -1
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
