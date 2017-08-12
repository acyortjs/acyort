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

  toBuild(data, ...types) {
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
    let args = types

    // set the posts data first
    // and reset the locale
    this.helper.setPosts(posts)
    this.helper.resetLocales()

    if (types.indexOf('all') > -1) {
      args = 'categories,tags,pages,posts,page,archives,category,tag'.split(',')
    }

    if (args.indexOf('categories') > -1) {
      this.toRender(data.categories, 'categories', this.getDir('category'))
    }

    if (args.indexOf('tags') > -1) {
      this.toRender(data.tags, 'tags', this.getDir('tag'))
    }

    if (args.indexOf('pages') > -1) {
      pages.forEach(p => this.toRender(p, 'page'))
    }

    if (args.indexOf('posts') > -1) {
      posts.forEach(p => this.toRender(p, 'post'))
    }

    if (args.indexOf('page') > -1) {
      page.forEach(p => this.toRender(p, 'index'))
    }

    if (args.indexOf('archives') > -1) {
      archives.forEach(p => this.toRender(p, 'archives'))
    }

    if (args.indexOf('category') > -1) {
      Object.keys(categories).forEach((c) => {
        categories[c].forEach(p => this.toRender(p, 'category'))
      })
    }

    if (args.indexOf('tag') > -1) {
      Object.keys(tags).forEach((t) => {
        tags[t].forEach(p => this.toRender(p, 'tag'))
      })
    }

    return Promise.resolve()
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
      this.toBuild(data, 'all')
    }
  }
 }

module.exports = Render
