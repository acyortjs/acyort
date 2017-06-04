const Category = require('./category')
const Filter = require('./filter')
const Page = require('./page')
const Pagination = require('pagination')
const Tag = require('./tag')
const Thumb = require('./thumb')
const Toc = require('./toc')

class Serialize {
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

    this.category = new Category(config)
    this.filter = new Filter(config)
    this.page = new Page(markeder)
    this.pagination = new Pagination(config)
    this.tag = new Tag(config)
    this.thumb = new Thumb(config)
    this.toc = new Toc(markeder)
  }

  serializer(issues) {
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
