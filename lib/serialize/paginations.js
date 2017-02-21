const pathFn = require('path')

function Paginations(data) {
  const config = global.config
  const { type, id, name } = data
  const posts = data.posts.map(post => post.id || post)

  function getRoute() {
    let route = 'page'

    if (type === 'tag') {
      route = `${config.tag_dir}/${id}`
    }
    if (type === 'category') {
      route = `${config.category_dir}/${id}`
    }
    if (type === 'archives') {
      route = config.archives_dir
    }

    return route
  }

  const perpage = type === 'archives' ? config.archives_per_page : config.per_page
  const paginations = []
  const prev = ''
  const next = ''
  const route = getRoute()
  const path = pathFn.join('/', (route === 'page' ? '' : route), 'index.html')

  let page = 1

  if (perpage === 0 || posts.length <= perpage) {
    paginations.push({ id: (id || 0), name, prev, next, posts, path })
    return paginations
  }

  for (let i = 0; i < posts.length; i += perpage) {
    const pagination = { id: (id || 0), name, prev, next, path }
    pagination.posts = posts.slice(i, i + perpage)

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
