const _ = require('lodash')
const config = require('../config')

class Jsonify {
  constructor() {
    this._config = config
    this._posts = null
    this._pages = null
    this._paginations = null
  }

  get({ posts, pages, paginations }) {
    this._posts = posts
    this._pages = pages
    this._paginations = paginations

    this._setConfig()
    this._setPosts()
    this._setPages()
    this._setPaginations()

    return _.pick(this, ['config', 'posts', 'pages', 'paginations'])
  }

  _setConfig() {
    const { tags, categories } = this._paginations

    this._config = Object.assign(_.omit(this._config, ['token']), {
      posts: this._posts.map(post => post.id),
      pages: this._pages.map(page => _.pick(page, ['id', 'name'])),
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

  _setPosts() {
    this._posts = this._posts.map(post => Object.assign(
        _.omit(post, ['raw', 'summay', 'path', 'url']), {
          prev: this._getPostById(post.prev),
          next: this._getPostById(post.next),
          category: _.pick(post.category, ['id', 'name']),
          tags: post.tags.map(tag => _.pick(tag, ['id', 'name'])),
        }
      )
    })
  }

  _setPages() {
    this._pages = this._pages.map(page => _.omit(page, ['path', 'url']))
  }

  _setPaginations() {
    Object.keys(this._paginations).forEach((key) => {
      const current = this._paginations[key]

      if (!Array.isArray(current)) {
        Object.keys(current).forEach((subkey) => {
          const sub = current[subkey]

          this._paginations[key][subkey] = sub.map((p) => {
            const posts = p.posts.map(id => this._getPostById(id))
            return { id: p.id, name: p.name, posts }
          })
        })
      } else {
        this._paginations[key] = current.map(p => p.posts.map(id => this._getPostById(id)))
      }
    })
  }

  _getPostById(id) {
    let post = this._posts.find(p => p.id === id)

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
