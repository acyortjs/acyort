
// data serialize

var _authors = require('./authors');
var _category = require('./category');
var _tag = require('./tag');
var _thumb = require('./thumb');
var _time = require('./time');
var _content = require('./content');
var _page = require('./page');
var _unique = require('./unique');

module.exports = function(data) {

    var posts = [];
    var categories = [];
    var tags = [];
    var pages = [];

    // authors filter
    data = _authors(data)

    data.forEach(function(e, i) {

        posts[i] = {};

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

        // post time
        posts[i].time = _time(e.created_at);

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
        };
        posts[i].path = '/'+ posts[i].time.YYYY +'/'+ posts[i].time.MM +'/'+ e.id +'.html';

    })

    // page posts
    var page_post_arr = _page(posts);

    pages = page_post_arr[0];
    posts = page_post_arr[1];

    // [posts, pages, all categories, all tags]
    return {
        posts: posts,
        pages: pages,
        categories: _unique(categories),
        tags: _unique(tags)
    }

}
