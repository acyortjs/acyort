const pathFn = require('path')
const config = require('../config')()
const archives = require('./archives')
const { convert } = require('../util')

function Paginations(posts, type) {
    const heading = type.split('/')[1] || config.title

    // route: 'page' || 'archives' || 'category/one' || 'tag/one'
    const route = convert(type)

    const perpage = route === 'archives' ? config.archives_per_page : config.per_page
    const paginations = []
    const prev = ''
    const next = ''
    const path = pathFn.join('/', (route === 'page' ? '' : route), 'index.html')

    let page = 1

    if (perpage === 0 || posts.length <= perpage) {
        paginations.push({ heading, prev, next, posts, path })

        if (route === 'archives') {
            paginations[0].posts = archives(posts)
        }

        return paginations
    }

    for (let i = 0; i < posts.length; i += perpage) {
        const pagination = { heading, prev, next, path }

        pagination.posts = route === 'archives' ? archives(posts.slice(i, i + perpage)) : posts.slice(i, i + perpage)

        if (page !== 1) {
            pagination.path = pathFn.join('/', route, page.toString(), 'index.html')
            pagination.prev = pathFn.join('/', config.root, route, (page - 1).toString(), '/')
        }

        if (page === 2) {
            pagination.prev = pathFn.join('/', config.root, (route === 'page' ? '' : route), '/')
        }

        if (page !== Math.ceil(posts.length / perpage)) {
            pagination.next = pathFn.join('/', config.root, route, (page + 1).toString(), '/')
        }

        paginations.push(pagination)
        page += 1
    }

    return paginations
}

module.exports = Paginations
