
// return categories

var config = require('../config');

require('./totrim')()

module.exports = function(issue) {

    if (!issue.labels.length) {
        return [{
            name: config.default_category,
            url: config.root +'/category/'+ config.default_category.totrim() +'/'
        }]
    }

    return issue.labels.map(function(label) {
        return {
            name: label.name,
            url: config.root +'/category/'+ label.name.totrim() +'/'
        }
    })

}

