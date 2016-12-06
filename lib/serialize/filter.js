const _path = require('path')
const marked = require('./marked')
const config = require('../config')()

module.exports = function filter(issues) {
    const posts = []
    const pages = []

    for (let i = 0; i < issues.length; i ++) {
        const issue = issues[i]

        if (config.authors && config.authors.indexOf(issue.user.login) == -1) {
            continue
        }

        if (issue.title.indexOf('[') > -1 && issue.title.indexOf(']') > -1) {
            const id = issue.id
            const path = _path.join('/', issue.title.substr(1, issue.title.indexOf(']') - 1).transform(), 'index.html')
            const url = _path.join(config.root, issue.title.substr(1, issue.title.indexOf(']') - 1).transform(), '/')
            const title = issue.title.split(']')[1]
            const created = issue.created_at
            const updated = issue.updated_at
            const content = marked(issue.body)

            pages.push({ id, url, path, title, created, updated, content })
        } else {
            posts.push(issue)
        }
    }

    return { pages, posts }
}
