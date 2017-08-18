const _ = require('lodash')
const config = require('../config')
const markeder = require('../markeder')
const postCategory = require('./category')
const issueFilter = require('./filter')
const postPage = require('./page')
const postTag = require('./tag')
const postThumb = require('./thumb')
const postToc = require('./toc')
const postSummary = require('./summary')
const Pagination = require('./pagination')
const Jsonify = require('./jsonify')

const paginationFn = data => new Pagination().get(data)
const jsonifyFn = data => new Jsonify().get(data)

class Processor {
  constructor() {
    this._config = config
    this.categories = []
    this.tags = []
    this.posts = []
    this.pages = []
    this.paginations = { categories: {}, tags: {} }
  }

  _setPosts(posts) {
    this.posts = posts.map((post, i) => {
      const data = this._post(post)

      data.prev = i > 0 ? posts[i - 1].id : ''
      data.next = i < posts.length - 1 ? posts[i + 1].id : ''

      return data
    })
  }

  _setCategories(post) {
    const index = this.categories.map(c => c.name).indexOf(post.category.name)
    const { id, name, url } = post.category

    if (index === -1) {
      this.categories.push({
        id,
        name,
        url,
        posts: [post.id],
      })
    } else {
      this.categories[index].posts.push(post.id)
    }
  }

  _setPaginations() {
    const { _config: { title }, posts } = this

    this.paginations.page = paginationFn({ name: title, posts })
    this.paginations.archives = paginationFn({ name: title, type: 'archives', posts })
    this.categories.forEach((c) => {
      const category = Object.assign({ type: 'category' }, _.pick(c, ['name', 'id', 'posts']))
      this.paginations.categories[c.id] = paginationFn(category)
    })
    this.tags.forEach((t) => {
      const tag = Object.assign({ type: 'tag' }, _.pick(t, ['name', 'id', 'posts']))
      this.paginations.tags[t.id] = paginationFn(tag)
    })
  }

  _setTags(post) {
    post.tags.forEach((tag) => {
      const index = this.tags.map(t => t.name).indexOf(tag.name)
      const { id, name, url } = tag

      if (index === -1) {
        this.tags.push({
          id,
          name,
          url,
          posts: [post.id],
        })
      } else {
        this.tags[index].posts.push(post.id)
      }
    })
  }

  _post(post) {
    const {
      id,
      created_at,
      updated_at,
      title,
      user: {
        login,
        avatar_url,
        html_url,
      },
      body,
    } = post

    const data = {
      id,
      created: created_at,
      updated: updated_at,
      title,
      path: `/${this._config.post_dir}/${id}.html`,
      url: `/${this._config.post_dir}/${id}.html`,
      author: {
        name: login,
        avatar: avatar_url,
        url: html_url,
      },
      raw: markeder(body, true),
      toc: postToc(body),
      category: postCategory(post),
      tags: postTag(post),
    }

    const { thumb, content } = postThumb(body)
    const { summary, main } = postSummary(content)

    data.thumb = thumb
    data.summary = markeder(summary)
    data.content = markeder(main)

    return data
  }

  _setPages(pages) {
    this.pages = pages.map(page => postPage(page))
  }

  process(issues) {
    const { pages, posts } = issueFilter(issues)
    const { json } = this._config

    if (!pages.length && !posts.length) {
      return Promise.reject('No contents')
    }

    this._setPages(pages)
    this._setPosts(posts)
    this.posts.forEach((post) => {
      this._setCategories(post)
      this._setTags(post)
    })
    this._setPaginations()

    const data = _.pick(this, ['posts', 'pages', 'categories', 'tags', 'paginations'])

    return Promise.resolve(json ? jsonifyFn(data) : data)
  }
}

module.exports = Processor
