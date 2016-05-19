
// return pages and issues

var marked = require('./marked');
var config = require('../config');

require('./format')()

module.exports = function(issues) {

    var pages = [];

    issues.forEach(function(issue) {

        var page = {}

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

        }

    })

    return {
        pages: pages,
        issues: issues.filter(function(issue) {
            return !(issue.title.indexOf('[') > -1 && issue.title.indexOf(']') > -1) 
        })
    }

}
