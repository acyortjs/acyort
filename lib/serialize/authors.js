
// authors filter

var config = require('../config');

module.exports = function(posts) {

    if (!config.authors) {
        return posts
    }

    return posts.filter(function(post) {
        return config.authors.indexOf(post.user.login) > -1
    })

}
