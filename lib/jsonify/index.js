const _ = require('lodash')

class Jsonify {
  constructor(data) {
    const { config, posts, pages, paginations } = data

    this.config = config
    this.posts = posts
    this.pages = pages
    this.paginations = paginations
  }

  getConfig() {
    this.config = Object.assign(_.omit(this.config, ['token']), {
      posts: this.posts.map(post => post.id),
      pages: this.pages.map(page => _.pick(page, ['id', 'name'])),
      tags: Object.keys(this.paginations.tags).map((id) => {
        const tag = this.paginations.tags[id]

        return {
          id,
          name: tag[0].name,
          count: tag.reduce((prev, current) => prev + current.posts.length),
        }
      }),
      categories: Object.keys(this.paginations.categories).map((id) => {
        const category = this.paginations.categories[id]

        return {
          id,
          name: category[0].name,
          count: category.reduce((prev, current) => prev + current.posts.length),
        }
      }),
    })
  }

  getPosts() {
    return this.posts.map((post) => {
      return Object.assign(_.omit(post, ['raw', 'summay', 'path', 'url']), {
        prev: this.getPostById(post.prev),
        next: this.getPostById(post.next),
        category: _.pick(post.category, ['id', 'name']),
        tags: post.tags.map(tag => _.pick(tag, ['id', 'name'])),
      })
    })
  }

  getPages() {
    return this.pages.map(page => _.omit(page, ['path', 'url']))
  }

  getPaginations(paginations) {
    for (let key in paginations) {
      const current = paginations[key]

      if (current.posts) {
        current.posts = current.posts.map(id => this.getPostById(id))
      } else {
        this.getPaginations(current)
      }
    }
  }

  getPostById(id) {
    let post = this.posts.find(post => post.id === id)

    if (!post) {
      return ''
    }

    post = _.omit(post, ['raw', 'toc', 'content', 'path', 'url', 'prev', 'next'])
    post.category = _.pick(post.category, ['id', 'name'])
    post.tags = post.tags.map(tag => _.pick(tag, ['id', 'name']))

    return post
  }
}
