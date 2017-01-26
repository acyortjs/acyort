const marked = require('./marked')
const pathFn = require('path')
const { strFormat } = require('../util')

function Page(issue, config) {
    let { title } = issue

    const { id } = issue
    const name = strFormat(title.substr(1, title.indexOf(']') - 1))
    const path = pathFn.join(name, 'index.html')
    const url = pathFn.join('/', config.root, name, '/')
    const created = issue.created_at
    const updated = issue.updated_at
    const content = marked(issue.body)

    title = title.split(']')[1]

    return { id, url, path, title, created, updated, content }
}

module.exports = Page
