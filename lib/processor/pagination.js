const path = require('path')

function getPath(route, page = 1) {
  if (page === 1) {
    if (route === 'page') {
      return '/index.html'
    }
    return path.join('/', route, 'index.html')
  }
  return path.join('/', route, page.toString(), 'index.html')
}

function getPostIds(posts) {
  return posts.map(post => post.id || post)
}

class Pagination {
  constructor(config) {
    this._archives_per_page = config.archives_per_page
    this._per_page = config.per_page
    this._root = config.root
    this._archives_dir = config.archives_dir
    this._category_dir = config.category_dir
    this._tag_dir = config.tag_dir
  }

  _getPerPage(type) {
    return type === 'archives' ? this._archives_per_page : this._per_page
  }

  _getPrev(route, page) {
    if (page === 1) {
      return ''
    }
    if (page === 2) {
      return path.join('/', this._root, (route === 'page' ? '' : route), '/')
    }
    return path.join('/', this._root, route, (page - 1).toString(), '/')
  }

  _getNext(route, page) {
    return path.join('/', this._root, route, (page + 1).toString(), '/')
  }

  _getRoute(type = 'page', id) {
    if (type === 'archives') {
      return this._archives_dir
    }

    if (type === 'page') {
      return 'page'
    }

    return `${this[`_${type}_dir`]}/${id}`
  }

  get(data) {
    const { type, id, name } = data
    const posts = getPostIds(data.posts)
    const perpage = this._getPerPage(type)
    const route = this._getRoute(type, id)
    const pagination = []
    const total = perpage === 0 ? 1 : Math.ceil(posts.length / perpage)

    let page = 1

    if (perpage === 0 || posts.length <= perpage) {
      return [{
        id: id || 0,
        name,
        prev: '',
        next: '',
        posts,
        path: getPath(route),
        current: 1,
        total: 1,
      }]
    }

    for (let i = 0; i < posts.length; i += perpage) {
      pagination.push({
        id: id || 0,
        name,
        prev: this._getPrev(route, page),
        next: this._getNext(route, page),
        posts: posts.slice(i, i + perpage),
        path: getPath(route, page),
        current: page,
        total,
      })

      if (page === total) {
        pagination[page - 1].next = ''
      }

      page += 1
    }

    return pagination
  }
}

module.exports = Pagination
