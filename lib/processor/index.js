const _ = require('lodash')
const Category = require('./category')
const Filter = require('./filter')
const Page = require('./page')
const Pagination = require('./pagination')
const Tag = require('./tag')
const Thumb = require('./thumb')
const Toc = require('./toc')

class Processor {
  constructor(acyort) {
    const { config, markeder } = acyort

    this.categories = []
    this.tags = []
    this.posts = []
    this.pages = []
    this.paginations = {
      categories: {},
      tags: {},
    }

    this.config = config
    this.markeder = markeder
    this.category = new Category(config)
    this.filter = new Filter(config)
    this.page = new Page(markeder)
    this.pagination = new Pagination(config)
    this.tag = new Tag(config)
    this.thumb = new Thumb(config)
    this.toc = new Toc(markeder)
  }

  getSummary(post) {
    const regex = /<!--\s*more\s*-->/
    const splited = post.split(regex)

    if (splited.length > 1) {
      return splited[0]
    }
    return ''
  }

  getPosts(posts) {
    return posts.map((post, i) => {
      return this.getPost(post)
      .then((data) => {
        data.prev = i > 0 ? posts[i - 1].id : ''
        data.next = i < posts.length - 1 ? posts[i + 1].id : ''

        return data
      })
    })
  }

  getCategories(post) {
    const index = this.categories.map(c => c.name).indexOf(post.category.name)
    const { id, name, url } = post.category

    if (index > -1) {
      this.categories[index].posts.push(post.id)
    } else {
      this.categories.push({
        id,
        name,
        url,
        posts: [post.id],
      })
    }
  }

  getPaginations() {
    this.paginations.page = this.pagination.getPagination({
      name: this.config.title,
      posts: this.posts,
    })
    this.paginations.archives = this.pagination.getPagination({
      name: this.config.title,
      type: 'archives',
      posts: this.posts,
    })
    this.categories.forEach((category) => {
      const args = Object.assign({ type: 'category' }, _pick(category, ['name', 'id', 'posts']))
      this.paginations.categories[category.id] = this.pagination.getPagination(args)
    })
    this.tags.forEach((tag) => {
      const args = Object.assign({ type: 'tag' }, _pick(tag, ['name', 'id', 'posts']))
      this.paginations.tags[tag.id] = this.pagination.getPagination(args)
    })
  }

  getTags(post) {
    post.tags.forEach((tag) => {
      const index = this.tags.map(t => t.name).indexOf(tag.name)
      const { id, name, url } = tag

      if (index > -1) {
        this.tags[index].posts.push(post.id)
      } else {
        this.tags.push({
          id,
          name,
          url,
          posts: [post.id],
        })
      }
    })
  }

  getPost(post) {
    const data = {
      id: post.id,
      created: post.created_at,
      updated: post.updated_at,
      title: post.title,
      path: `/${this.config.post_dir}/${post.id}.html`,
      url: `/${this.config.post_dir}/${post.id}.html`,
      author: {
        name: post.user.login,
        avatar: post.user.avatar_url,
        url: post.user.html_url,
      },
      raw: this.markeder(post.body, true),
      toc: this.markeder(this.toc.getToc(post.body)),
      category: this.category.getCategory(post),
      tags: this.tag.getTag(post),
    }

    this.thumb.getThumb(post.body)
    .then(({ thumb, content }) => {
      data.thumb = thumb
      data.summary = this.markeder(this.getSummary(content))
      data.content = this.markeder(content)

      return Promise.reslove(data)
    })
  }

  process(issues) {
    this.filter.filterContent(issues)
    .then(({ pages, posts }) => {
      if (!pages.length && !posts.length) {
        return Promise.reject('No contents')
      }

      this.posts = posts
      this.pages = pages.map(page => this.page.getPage(page))
    })
  }
}

module.exports = Processor
