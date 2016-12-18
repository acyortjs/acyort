const pathFn = require('path')
const marked = require('./marked')
const config = require('../config')()
const { strFormat } = require('../util')

function Filter(issues) {
    const posts = []
    const pages = []

    for (let i = 0; i < issues.length; i += 1) {
        const issue = issues[i]

        if (!config.authors || config.authors.indexOf(issue.user.login) > -1) {
            if (issue.title.indexOf('[') > -1 && issue.title.indexOf(']') > -1) {
                const id = issue.id
                const name = strFormat(issue.title.substr(1, issue.title.indexOf(']') - 1))
                const path = pathFn.join('/', name, 'index.html')
                const url = pathFn.join('/', config.root, name, '/')
                const title = issue.title.split(']')[1]
                const created = issue.created_at
                const updated = issue.updated_at
                const content = marked(issue.body)

                pages.push({ id, url, name, path, title, created, updated, content })
            } else {
                posts.push(issue)
            }
        }
    }

    return { pages, posts }
}

module.exports = Filter
