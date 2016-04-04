
var config = require('./lib/config');
var fetch = require('./lib/fetch');
var feed = require('./lib/feed');
var template = require('./lib/template');
var pager = require('./lib/pager');
var render = require('./lib/render');
var archives = require('./lib/archives');
var serialize = require('./lib/serialize');

fetch(function(data) {
    build(serialize(data))
})

function build(data) {

    // copy assets
    //require('./lib/assets.js')()

    // rss
    //feed(data.posts)

    // pages
    //data.pages.forEach(function(page) {
        //render(page.path, template('page'), page)
    //})
    
    // archives
    //render('/archives/index.html', template('archives'), archives(data.posts))

    // posts
    //data.posts.forEach(function(post) {
        //render(post.path, template('post'), post)
    //})





    /*
    // posts pages
    pager(posts, 'index')


    // tag
    tags.forEach(function(tag) {
        pager(tag.posts, 'tag/'+ tag.name)

        // tags
        tag.number = tag.posts.length;
    })

    // category
    categories.forEach(function(category) {
        pager(category.posts, 'category/'+ category.name)

        // categories
        category.number = category.posts.length
    })



    // render tags and categories
    var all_tags = { data: tags };
    var all_categories = { data: categories };
    render('/tags/index.html', tpl('tags'), all_tags)
    render('/categories/index.html', tpl('categories'), all_categories)
    */

}
