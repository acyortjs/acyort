
var config = require('./lib/config.js'),
    get = require('./lib/get.js'),
    post = require('./lib/post.js'),
    feed = require('./lib/feed.js'),
    template = require('./lib/template.js'),
    pager = require('./lib/pager.js'),
    fs = require('fs-extra'),
    render = require('./lib/render.js');

var label_data = [], post_data = [], page_data = [];

get('labels', function(data) {

    data.forEach(function(e) {
        e.posts = []
    })

    label_data = data;


    get('issues', function(data) {

        // authors filter
        if (config.authors.length > 0) {
            data.forEach(function(e) {
                config.authors.forEach(function(author) {
                    if (author == e.user.login) {
                        post_data.push(e)
                        return
                    }
                })
            })
        } else {
            post_data = data
        }

        // post data handing
        post_data = post(post_data);

        // page posts
        post_data.forEach(function(e, i) {
            if (e.title.indexOf('[') > -1 && e.title.indexOf(']') > -1) {
                page_data = page_data.concat(post_data.splice(i, 1))
            }
        })

        // labels
        post_data.forEach(function(post) {
            post.labels.forEach(function(label) {
                label_data.forEach(function(e, i) {
                    if (e.name == label.name) {
                        e.posts.push(post)
                    }
                    return
                })
            })
        })

        build_html()

    })

})

function build_html() {
    console.log('Building Html...')

    // tags pages
    label_data.forEach(function(label) {
        if (label.posts.length) {
            pager(label.posts, 'tags/'+ label.name, label.name)
        }
    })

    // posts
    post_data.forEach(function(post) {
        var time = post.created_at.split('T')[0].split('-');
        render(time[0] +'/'+ time[1] +'/'+ post.id +'.html', template('post'), post)
    })

    // rss
    feed(post_data)

    // page posts
    page_data.forEach(function(post) {
        var title = post.title.substr(1, post.title.indexOf(']') - 1),
            path = title +'/index.html';

        post.page_title = title;
        post.title = post.title.split(']')[1];

        render(path, template('page'), post)
    })

    // posts pages
    pager(post_data, 'page')

    // archives pages
    pager(post_data, 'archives')

    // copy assets
    fs.copy('./themes/source', './public', function (err) {
        if (err) {
            return console.error(err)
        }
        console.log('Success coping assets')
    })

}
