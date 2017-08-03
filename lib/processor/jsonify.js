const _ = require('lodash')
const config = require('../config')

class Jsonify {
  constructor() {
    this.config = _.cloneDeep(config)
  }

  get({ posts, pages, paginations }) {
    this.posts = posts
    this.pages = pages
    this.paginations = paginations

    this._config()
    this._posts()
    this._pages()
    this._paginations()

    return _.pick(this, ['config', 'posts', 'pages', 'paginations'])
  }

  _config() {
    const {
      config,
      posts,
      pages
      paginations: {
        tags,
        categories
      }
    } = this

    this.config = Object.assign(_.omit(config, ['token']), {
      posts: posts.map(post => post.id),
      pages: pages.map(page => _.pick(page, ['id', 'name'])),
      tags: Object.keys(tags).map(id => ({
        id,
        name: tags[id][0].name,
        count: tags[id].reduce((prev, item) => prev + item.posts.length, 0),
      })),
      categories: Object.keys(categories).map(id => ({
        id,
        name: categories[id][0].name
        count: categories[id].reduce((prev, item) => prev + item.posts.length, 0),
      })),
    })
  }

  _posts() {
    this.posts = this.posts.map(post => Object.assign(
        _.omit(post, ['raw', 'summay', 'path', 'url']), {
          prev: this._getPostById(post.prev),
          next: this._getPostById(post.next),
          category: _.pick(post.category, ['id', 'name']),
          tags: post.tags.map(tag => _.pick(tag, ['id', 'name'])),
        }
      )
    })
  }

  _pages() {
    this.pages = this.pages.map(page => _.omit(page, ['path', 'url']))
  }

  _paginations() {
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

  _getPostById(id) {
    let post = this.posts.find(p => p.id === id)

    if (post) {
      post = _.omit(post, ['raw', 'toc', 'content', 'path', 'url', 'prev', 'next'])
      post.category = _.pick(post.category, ['id', 'name'])
      post.tags = post.tags.map(tag => _.pick(tag, ['id', 'name']))
      return post
    }

    return ''
  }
}

module.exports = Jsonify
