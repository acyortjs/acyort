const pathFn = require('path')
const config = require('../config')()

function Paginations(data) {
    const { type, id, name, posts } = data

    function getPath() {
        let route = ''

        if (type === 'tag') {
            route = `${config.tag_dir}/${id}`
        }
        if (type === 'category') {
            route = `${config.category_dir}/${id}`
        }
        if (type === 'archives') {
            route = config.archives_dir
        }

        return pathFn.join('/', route, 'index.html')
    }

    // const heading = type.split('/')[1] || config.title
    // route: 'page' || 'archives' || 'category/one' || 'tag/one'
    // const route = convert(type)

    const perpage = type === 'archives' ? config.archives_per_page : config.per_page
    const paginations = []
    const prev = ''
    const next = ''
    const path = getPath()

    let page = 1

    if (perpage === 0 || posts.length <= perpage) {
        paginations.push({ name, prev, next, posts, path })
        return paginations
    }

    for (let i = 0; i < posts.length; i += perpage) {
        const pagination = { name, prev, next, path }

        pagination.posts = posts.slice(i, i + perpage)

        if (page !== 1) {
            pagination.path = pathFn.join('/', path, page.toString(), 'index.html')
            pagination.prev = pathFn.join('/', config.root, path, (page - 1).toString(), '/')
        }

        if (page === 2) {
            pagination.prev = pathFn.join('/', config.root, path, '/')
        }

        if (page !== Math.ceil(posts.length / perpage)) {
            pagination.next = pathFn.join('/', config.root, path, (page + 1).toString(), '/')
        }

        paginations.push(pagination)
        page += 1
    }

    return paginations
}

module.exports = Paginations
