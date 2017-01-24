const marked = require('./marked')
const nodePath = require('path')
const { strFormat } = require('../util')

function Page(issue, config) {
    const { title, id } = issue

    if (title.indexOf('[') == -1 || title.indexOf(']') == -1) {
        return issue
    }

    const name = strFormat(title.substr(1, title.indexOf(']') - 1))
    const path = nodePath.join(name, 'index.html')
    const url = nodePath.join('/', config.root, name, '/')
    const title = title.split(']')[1]
    const created = issue.created_at
    const updated = issue.updated_at
    const content = marked(issue.body)

    return { id, url, path, title, created, updated, content }
}

module.exports = Page
