
const _path = require('path')
const config = require('../config')()
const _archives = require('./archives')
const { textTransform } = require('../util')

textTransform()

module.exports = function(posts, route) {
    const heading = route.split('/')[1] || config.title

    // route: 'page' || 'archives' || 'category/one' || 'tag/one'
    route = route.transform()

    const perpage = route == 'archives' ? config.archives_per_page : config.per_page
    const paginations = []

    let prev = ''
    let next = ''
    let page = 1
    let path = _path.join('/', route, 'index.html')

    if (perpage == 0 || posts.length <= perpage) {
        if (route == 'archives') {
            posts = _archives(posts)
        }
        paginations.push({ heading, prev, next, posts, path })
        return paginations       
    }

    for (let i = 0; i < posts.length; i += perpage) {
        const pagination = { heading, prev, next, path }

        pagination.posts = route == 'archives' ? _archives(posts.slice(i, i + perpage)) : posts.slice(i, i + perpage)

        if (page != 1) {
            pagination.path = _path.join('/', route, page.toString(), 'index.html')
            pagination.prev = _path.join(config.root, route, (page - 1).toString(), '/')
        }

        if (page == 2) {
            pagination.prev =  _path.join(config.root, (route == 'page' ? '' : route), '/')
        }

        if (page != Math.ceil(posts.length / perpage)) {
            pagination.next = _path.join(config.root, route, (page + 1).toString(), '/')
        }

        paginations.push(pagination)
        page ++
    }

    return paginations
}
