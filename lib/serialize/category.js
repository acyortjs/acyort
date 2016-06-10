
// return categories

var config = require('../config');

require('./format')()

module.exports = function(issue) {

    if (!issue.labels.length) {
        return [{
            name: config.default_category,
            url: config.root +'/'+ config.category_dir.format() +'/'+ config.default_category.format() +'/'
        }]
    }

    return issue.labels.map(function(label) {
        return {
            name: label.name,
            url: config.root +'/'+ config.category_dir.format() +'/'+ label.name.format() +'/'
        }
    })

}

