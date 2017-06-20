const _ = require('lodash')

class Jsonify {
  constructor(config) {
    this.config = config
  }

  _({ posts, pages, paginations }) {
    this.posts = posts
    this.pages = pages
    this.paginations = paginations

    this.setConfig()
    this.setPosts()
    this.setPages()
    this.setPaginations()

    return _.pick(this, ['config', 'posts', 'pages', 'paginations'])
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
      const tinyPost = _.omit(post, ['raw', 'summay', 'path', 'url'])
      return Object.assign(tinyPost, {
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

  setPaginations() {
    Object.keys(this.paginations).forEach((key) => {
      const current = this.paginations[key]

      if (!Array.isArray(current)) {
        Object.keys(current).forEach((subkey) => {
          const sub = current[subkey]

          this.paginations[key][subkey] = sub.map((p) => {
            const posts = p.posts.map(id => this.getPostById(id))
            return { id: p.id, name: p.name, posts }
          })
        })
      } else {
        this.paginations[key] = current.map(page => page.posts.map(id => this.getPostById(id)))
      }
    })
  }

  getPostById(id) {
    let post = this.posts.find(p => p.id === id)

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
