const pathFn = require('path')
const Renderer = require('./renderer/')
const Helper = require('./helper/')

class Render extends Renderer {
  constructor(acyort) {
    super(acyort)

    this.config = acyort.config
    this.helper = new Helper(acyort.config)
  }

  getDir(tag) {
    return pathFn.join(this.config[`${tag}_dir`], 'index.html')
  }

  getData(page) {
    return Object.assign({ page }, this.helper._())
  }

  toRender(data, template, path) {
    this.render(path || data.path, template, this.getData(data))
  }

  _(data) {
    const {
      pages,
      posts,
      paginations: {
        page,
        archives,
        categories,
        tags,
      },
    } = data

    this.helper.setPosts(posts)

    this.toRender(data.categories, 'categories', this.getDir('category'))
    this.toRender(data.tags, 'tags', this.getDir('tag'))

    pages.forEach(p => this.toRender(p, 'page'))
    posts.forEach(p => this.toRender(p, 'post'))
    page.forEach(p => this.toRender(p, 'index'))
    archives.forEach(p => this.toRender(p, 'archives'))

    Object.keys(categories).forEach((c) => {
      categories[c].forEach(p => this.toRender(p, 'category'))
    })
    Object.keys(tags).forEach((t) => {
      tags[t].forEach(p => this.toRender(p, 'tag'))
    })
  }
 }

module.exports = Render
