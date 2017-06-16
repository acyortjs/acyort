const pathFn = require('path')
const Renderer = require('./renderer/')
const Helper = require('./helper/')
const Rss = require('./rss')
const Source = require('./source')

class Render extends Renderer {
  constructor(acyort) {
    super(acyort)

    this.config = acyort.config
    this.helper = new Helper(acyort.config)
    this.rss = new Rss(acyort)
    this.source = new Source(acyort)
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
      config,
      pages,
      posts,
      paginations: {
        page,
        archives,
        categories,
        tags,
      },
    } = data

    if (config) {
      this.renderJson('config.json', config)

      pages.forEach(p => this.renderJson(`pages/${p.id}.json`, p))
      posts.forEach(p => this.renderJson(`posts/${p.id}.json`, p))
      page.forEach((p, i) => this.renderJson(`page/${i + 1}.json`, p))
      archives.forEach((p, i) => this.renderJson(`archives/${i + 1}.json`, p))

      Object.keys(categories).forEach((c) => {
        const dir = `categories/${categories[c][0].id}`
        categories[c].forEach((p, i) => this.renderJson(`${dir}/${i + 1}.json`, p))
      })
      Object.keys(tags).forEach((t) => {
        const dir = `tags/${tags[t][0].id}`
        tags[t].forEach((p, i) => this.renderJson(`${dir}/${i + 1}.json`, p))
      })
    } else {
      // set the posts data first
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

      this.rss._(posts)
      this.source._()
    }
  }
 }

module.exports = Render
