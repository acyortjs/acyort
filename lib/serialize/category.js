
// return categories

var config = require('../config');

module.exports = function(post) {

    if (!post.labels.length) {
        post.labels = [{name: config.default_category}]
    }

    var categories = [];

    post.labels.forEach(function(label) {
        categories.push(label.name)
    })

    return categories

}

