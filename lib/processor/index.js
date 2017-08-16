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
    this._categories = []
    this._tags = []
    this._posts = []
    this._pages = []
    this._paginations = { categories: {}, tags: {} }
  }

  _setPosts(posts) {
    this._posts = posts.map((post, i) => {
      const data = this._post(post)

      data.prev = i > 0 ? posts[i - 1].id : ''
      data.next = i < posts.length - 1 ? posts[i + 1].id : ''

      return data
    })
  }

  _setCategories(post) {
    const index = this._categories.map(c => c.name).indexOf(post.category.name)
    const { id, name, url } = post.category

    if (index === -1) {
      this._categories.push({
        id,
        name,
        url,
        posts: [post.id],
      })
    } else {
      this._categories[index].posts.push(post.id)
    }
  }

  _setPaginations() {
    const { title } = this._config
    const posts = this._posts
    const { categories, tags } = this._paginations

    this._paginations.page = paginationFn({ name: title, posts })
    this._paginations.archives = paginationFn({ name: title, type: 'archives', posts })
    categories.forEach((c) => {
      const category = Object.assign({ type: 'category' }, _.pick(c, ['name', 'id', 'posts']))
      this._paginations.categories[c.id] = paginationFn(category)
    })
    tags.forEach((t) => {
      const tag = Object.assign({ type: 'tag' }, _.pick(t, ['name', 'id', 'posts']))
      this._paginations.tags[t.id] = paginationFn(tag)
    })
  }

  _setTags(post) {
    post.tags.forEach((tag) => {
      const index = this._tags.map(t => t.name).indexOf(tag.name)
      const { id, name, url } = tag

      if (index === -1) {
        this._tags.push({
          id,
          name,
          url,
          posts: [post.id],
        })
      } else {
        this._tags[index].posts.push(post.id)
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
    const { post_dir } = this._config

    const data = {
      id,
      created: created_at,
      updated: updated_at,
      title,
      path: `/${post_dir}/${id}.html`,
      url: `/${post_dir}/${id}.html`,
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
    this._pages = pages.map(page => postPage(page))
  }

  process(issues) {
    const { pages, posts } = issueFilter(issues)
    const { json } = this._config

    if (!pages.length && !posts.length) {
      return Promise.reject('No contents')
    }

    this._setPages(pages)
    this._setPosts(posts)
    this._posts.forEach((post) => {
      this._setCategories(post)
      this._setTags(post)
    })
    this._setPaginations()

    const data = _.pick(this, ['posts', 'pages', 'categories', 'tags', 'paginations'])

    return Promise.resolve(json ? jsonifyFn(data) : data)
  }
}

module.exports = Processor
