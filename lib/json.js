const pathFn = require('path')
const fs = require('fs-extra')
const { log, objDelete, objFrom } = require('./util')

function Json(data) {
  const config = JSON.parse(JSON.stringify(global.config))
  const getPost = id => data.posts.find(post => post.id === id)

  const render = (path, content) => {
    const jsonPath = typeof config.json === 'string' ? config.json : ''
    const filePath = pathFn.join(process.cwd(), config.public_dir, jsonPath, path)
    fs.outputFileSync(filePath, JSON.stringify(content))
    log.done(path)
  }

  const simplePost = (id) => {
    if (!id) {
      return ''
    }

    const post = objDelete(getPost(id), 'raw', 'toc', 'content', 'path', 'url', 'prev', 'next')

    post.category = objFrom(post.category, 'id', 'name')
    post.tags = post.tags.map(tag => objFrom(tag, 'id', 'name'))

    return post
  }

  delete config.token

  config.pages = data.pages.map(page => page.id)
  config.posts = data.posts.map(post => post.id)
  config.categories = []
  config.tags = []

  log.info('Generating JSON ...')

  // posts
  data.posts.forEach((p) => {
    const post = objDelete(p, 'raw', 'summary', 'path', 'url')

    post.prev = simplePost(post.prev)
    post.next = simplePost(post.next)
    post.category = objFrom(post.category, 'id', 'name')
    post.tags = post.tags.map(tag => objFrom(tag, 'id', 'name'))

    render(`posts/${post.id}.json`, post)
  })

  // pages
  data.pages.forEach((p) => {
    config.pages.push(objFrom(p, 'id', 'name'))
    const page = objDelete(p, 'path', 'url')
    render(`pages/${page.id}.json`, page)
  })

  // tag
  Object.keys(data.paginations.tags).forEach((t) => {
    const thetag = data.paginations.tags[t]
    let num = 0

    data.paginations.tags[t].forEach((tag, i) => {
      const { id, name } = tag
      const count = tag.posts.length
      const posts = tag.posts.map(post => simplePost(post))

      num += count
      render(`tags/${id}/${i + 1}.json`, { id, name, count, posts })
    })

    config.tags.push({ id: t, name: thetag[0].name, count: num })
  })

  // category
  Object.keys(data.paginations.categories).forEach((c) => {
    const thecategory = data.paginations.categories[c]
    let num = 0

    data.paginations.categories[c].forEach((category, i) => {
      const { id, name } = category
      const count = category.posts.length
      const posts = category.posts.map(post => simplePost(post))

      num += count
      render(`categories/${id}/${i + 1}.json`, { id, name, count, posts })
    })

    config.categories.push({ id: c, name: thecategory[0].name, count: num })
  })

  // archives
  data.paginations.archives.forEach((archives, i) => {
    const posts = archives.posts.map(post => simplePost(post))
    render(`archives/${i + 1}.json`, posts)
  })

  // index
  data.paginations.index.forEach((index, i) => {
    const posts = index.posts.map(post => simplePost(post))
    render(`page/${i + 1}.json`, posts)
  })

  // config
  render('config.json', config)
}

module.exports = Json
