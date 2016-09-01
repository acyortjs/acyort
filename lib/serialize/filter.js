
// pages and posts filter

var marked = require('./marked');
var config = require('../config');

require('./format')()

module.exports = function(issues) {

    var posts = [];
    var pages = [];

    for (var i = 0; i < issues.length; i ++) {
        var issue = issues[i];
        var page = {};

        // authors filter
        if (config.authors && config.authors.indexOf(issue.user.login) == -1) {
            continue
        }

        if (issue.title.indexOf('[') > -1 && issue.title.indexOf(']') > -1) {

            page.id = issue.id;
            page.path = '/'+ issue.title.substr(1, issue.title.indexOf(']') - 1).format() +'/index.html';
            page.url = config.root + page.path;
            page.title = issue.title.split(']')[1];
            page.created = issue.created_at;
            page.updated = issue.updated_at;
            page.body = marked(issue.body);

            // pages push this item
            pages.push(page)

        } else {

            posts.push(issue)

        }
    }

    return {
        pages: pages,
        issues: posts
    }

}
