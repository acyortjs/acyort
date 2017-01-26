const pathFn = require('path')
const marked = require('./marked')
const pageFn = require('./page')
const { strFormat } = require('../util')

function Filter(issues, config) {
    const posts = []
    const pages = []

    issues.forEach(issue => {
        const { title, user: { login } } = issue

        if (config.authors && !config.authors.indexOf(login) == -1) {
            return
        }

        if (title.indexOf('[') > -1 && title.indexOf(']') > -1) {
            return pages.push(pageFn(issue, config))
        }

        return posts.push(issue)
    })

    return { pages, posts }
}

module.exports = Filter
