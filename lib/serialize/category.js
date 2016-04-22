
// return categories

var config = require('../config');

require('./totrim')()

module.exports = function(post) {

    if (!post.labels.length) {
        return [{
            name: config.default_category,
            url: config.root +'/category/'+ config.default_category.totrim() +'/'
        }]
    }

    return post.labels.map(function(label) {
        return {
            name: label.name,
            url: config.root +'/category/'+ label.name.totrim() +'/'
        }
    })

}

