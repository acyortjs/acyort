
// authors filter

var config = require('../config');

module.exports = function(issues) {

    if (!config.authors) {
        return issues
    }

    return issues.filter(function(issue) {
        return config.authors.indexOf(issue.user.login) > -1
    })

}
