const _ = require('lodash')

class Jsonify {
  constructor(config, data) {
    const { posts, pages, paginations, tags, categories } = data

    this.config = config
    this.posts = posts
    this.pages = pages
    this.paginations = paginations
    this.tags = tags
    this.categories = categories
  }

  _() {
    this.setConfig()
    this.setPosts()
    this.setPages()
    this.setPaginations()
  }

  setConfig() {
    this.config = Object.assign(_.omit(this.config, ['token']), {
      posts: this.posts.map(post => post.id),
      pages: this.pages.map(page => _.pick(page, ['id', 'name'])),
      tags: Object.keys(this.paginations.tags).map((id) => {
        const tag = this.paginations.tags[id]

        return {
          id,
          name: tag[0].name,
          count: tag.reduce((prev, current) => prev + current.posts.length, 0),
        }
      }),
      categories: Object.keys(this.paginations.categories).map((id) => {
        const category = this.paginations.categories[id]

        return {
          id,
          name: category[0].name,
          count: category.reduce((prev, current) => prev + current.posts.length, 0),
        }
      }),
    })
  }

  setPosts() {
    this.posts = this.posts.map((post) => {
      return Object.assign(_.omit(post, ['raw', 'summay', 'path', 'url']), {
        prev: this.getPostById(post.prev),
        next: this.getPostById(post.next),
        category: _.pick(post.category, ['id', 'name']),
        tags: post.tags.map(tag => _.pick(tag, ['id', 'name'])),
      })
    })
  }

  setPages() {
    this.pages = this.pages.map(page => _.omit(page, ['path', 'url']))
  }

  setPaginations(paginations = this.paginations) {
    for (const key in paginations) {
      const current = paginations[key]

      if (Array.isArray(current)) {
        paginations[key] = current.map(page => page.posts.map(id => this.getPostById(id)))
      } else {
        this.setPaginations(current)
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

module.exports = Jsonify
