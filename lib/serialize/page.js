const marked = require('./marked')
const pathFn = require('path')
const { strFormat } = require('../util')

function Page(issue) {
    const config = global.config
    const { id, title } = issue
    const name = strFormat(title.substr(1, title.indexOf(']') - 1))
    const path = pathFn.join(name, 'index.html')
    const url = pathFn.join(name, '/')
    const created = issue.created_at
    const updated = issue.updated_at
    const content = marked(issue.body)

    return {
        id,
        url,
        path,
        title: issue.title.split(']')[1],
        created,
        updated,
        content,
    }
}

module.exports = Page
