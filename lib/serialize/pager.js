
const _path = require('path')
const config = require('../config')()
const _archives = require('./archives')
const { textTransform } = require('../util')

textTransform()

module.exports = function(posts, route) {

    // route: 'page' || 'archives' || 'category/one' || 'tag/one'
    route = route.transform()

    const heading = route.split('/')[1] || config.title
    const perpage = route == 'archives' ? config.archives_per_page : config.per_page
    const paginations = []

    let prev = ''
    let next = ''
    let page = 1
    let path = _path.join('/', route, 'index.html')

    if (posts.length <= perpage) {
        return paginations.push({ heading, prev, next, posts, path })       
    }

    for (let i = 0; i < posts.length; i += perpage) {
        const posts = route == archives ? _archives(posts.slice(i, i + perpage)) : posts.slice(i, i + perpage)
        const pagination = { heading, prev, next, posts, path }

        if (page != 1) {
            pagination.path = _path.join('/', route, page, 'index.html')
            pagination.prev = _path.join(config.root, route, page - 1, '/')
        }

        if (page == 2) {
            pagination.prev =  _path.join(config.root, (route == 'page' ? '' : route), '/')
        }

        if (page != Math.ceil(posts.length / perpage)) {
            pager.next = _path.join(config.root, route, page + 1, '/')
        }

        paginations.push(pagination)
        page ++
    }

    return paginations
    
}
