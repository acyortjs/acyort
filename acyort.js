
var config = require('./config.js'),
    dir = require('./modules/dir.js'),
    get = require('./modules/get.js'),
    post = require('./modules/post.js'),
    timeFormat = require('./modules/time.js'),
    templates = require('./modules/template.js'),
    render = require('./modules/render.js');

dir('./posts', './pages')

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
                label_data.forEach(function(e) {
                    if (e.name == label.name) {
                        var time = post.created_at.split('T')[0].split('-'),
                            o = {
                            title:      post.title,
                            post_time:  timeFormat(post.updated_at.split('T')[0]),
                            path:       '/posts/'+ time[0] +'/'+ time[1] +'/'+ post.id +'.html'
                        };
                        e.tag_name = e.name;
                        e.posts.push(o)
                    }
                    return
                })
            })
        })

        console.log(label_data)

    })

})

