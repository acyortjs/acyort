
var config = require('./config.js'),
    dir = require('./modules/dir.js'),
    get = require('./modules/get.js'),
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

        console.log(post_data)

    })

})

