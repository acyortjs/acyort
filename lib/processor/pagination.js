const pathFn = require('path')

class Pagination {
  constructor(config) {
    this.config = config
    this.pagination = []
  }

  getPerPage(type) {
    return type === 'archives' ? this.config.archives_per_page : this.config.per_page
  }

  getPath(route, page = 1) {
    const path = page === 1 && route === 'page' ? '' : route
    return pathFn.join('/', path, 'index.html')
  }

  getPrev(route, page) {
    if (page === 1) {
      return ''
    }
    if (page === 2) {
      return pathFn.join('/', this.config.root, (route === 'page' ? '' : route), '/')
    }
    return pathFn.join('/', this.config.root, route, (page - 1).toString(), '/')
  }

  getNext(route, page) {
    return pathFn.join('/', this.config.root, route, (page + 1).toString(), '/')
  }

  getPostIds(posts) {
    return posts.map(post => post.id || post)
  }

  getRoute(type = 'page', id) {
    if (type === 'archives') {
      return this.config.archives_dir
    }

    if (type === 'page') {
      return 'page'
    }

    return `${this.config[`${type}_dir`]}/${id}`
  }

  getPagination(data) {
    const { type, id, name } = data
    const posts = this.getPostIds(data.posts)
    const perpage = this.getPerPage(type)
    const route = this.getRoute(type)

    if (perpage === 0 || posts.length <= perpage) {
      return [{
        id: id || 0,
        name,
        prev: '',
        next: '',
        posts,
        path: this.getPath(route),
        current: 1,
        total: 1,
      }]
    }

    const total = Math.ceil(posts.length / perpage)
    let page = 1

    for (let i = 1; i < posts.length; i += perpage) {
      this.pagination.push({
        id: id || 0,
        name,
        prev: this.getPrev(route, page),
        next: this.getNext(route, page),
        posts: posts.slice(i, i + perpage),
        path: this.getPath(route, page),
        current: page,
        total,
      })

      if (page === total) {
        this.pagination[page].next = ''
      }

      page += 1
    }

    return this.pagination
  }
}

module.exports = Pagination
