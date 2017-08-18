const _ = require('lodash')
const config = require('../config')

class Jsonify {
  constructor() {
    this.config = config
    this.posts = null
    this.pages = null
    this.paginations = null
  }

  get({ posts, pages, paginations }) {
    this.posts = posts
    this.pages = pages
    this.paginations = paginations

    this._setConfig()
    this._setPosts()
    this._setPages()
    this._setPaginations()

    return _.pick(this, ['config', 'posts', 'pages', 'paginations'])
  }

  _setConfig() {
    const { tags, categories } = this.paginations

    this.config = Object.assign(_.omit(this.config, ['token']), {
      posts: this.posts.map(post => post.id),
      pages: this.pages.map(page => _.pick(page, ['id', 'name'])),
      tags: Object.keys(tags).map(id => ({
        id,
        name: tags[id][0].name,
        count: tags[id].reduce((prev, item) => prev + item.posts.length, 0),
      })),
      categories: Object.keys(categories).map(id => ({
        id,
        name: categories[id][0].name,
        count: categories[id].reduce((prev, item) => prev + item.posts.length, 0),
      })),
    })
  }

  _setPosts() {
    this.posts = this.posts.map((p) => {
      const post = _.omit(p, ['raw', 'summay', 'path', 'url'])

      post.prev = this._getPostById(post.prev)
      post.next = this._getPostById(post.next)
      post.category = _.pick(post.category, ['id', 'name'])
      post.tags = post.tags.map(tag => _.pick(tag, ['id', 'name']))

      return post
    })
  }

  _setPages() {
    this.pages = this.pages.map(page => _.omit(page, ['path', 'url']))
  }

  _setPaginations() {
    Object.keys(this.paginations).forEach((key) => {
      const current = this.paginations[key]

      if (!Array.isArray(current)) {
        Object.keys(current).forEach((subkey) => {
          const sub = current[subkey]

          this.paginations[key][subkey] = sub.map((p) => {
            const posts = p.posts.map(id => this._getPostById(id))
            return { id: p.id, name: p.name, posts }
          })
        })
      } else {
        this.paginations[key] = current.map(p => p.posts.map(id => this._getPostById(id)))
      }
    })
  }

  _getPostById(id) {
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
