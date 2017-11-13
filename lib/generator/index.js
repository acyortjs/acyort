const path = require('path')
const Render = require('../render')
const Source = require('./source')
const Rss = require('./rss')
const Helper = require('./helper')
const config = require('../config')

class Generator extends Render {
  constructor(acyort) {
    super(acyort)
    this._config = acyort.config
    this._helper = new Helper(acyort.config)
    this._source = new Source(acyort)
    this._rss = new Rss(acyort)
  }

  _tagPath(tag) {
    return path.join(this._config[`${tag}_dir`], 'index.html')
  }

  _data(page) {
    return Object.assign({ page }, this._helper.functions)
  }

  copySources() {
    this._source.copy()
  }

  genHtmls(data, ...types) {
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
    // for liveReload
    this._helper.setPosts(posts)
    this._helper.resetLocales()

    if (types.indexOf('all') > -1) {
      args = 'categories,tags,pages,posts,page,archives,category,tag'.split(',')
    }

    if (args.indexOf('categories') > -1) {
      this.render(this._tagPath('category'), 'categories', this._data(data.categories))
    }

    if (args.indexOf('tags') > -1) {
      this.render(this._tagPath('tag'), 'tags', this._data(data.tags))
    }

    if (args.indexOf('pages') > -1) {
      pages.forEach(p => this.render(p.path, 'page', this._data(p)))
    }

    if (args.indexOf('posts') > -1) {
      posts.forEach(p => this.render(p.path, 'post', this._data(p)))
    }

    if (args.indexOf('page') > -1) {
      page.forEach(p => this.render(p.path, 'index', this._data(p)))
    }

    if (args.indexOf('archives') > -1) {
      archives.forEach(p => this.render(p.path, 'archives', this._data(p)))
    }

    if (args.indexOf('category') > -1) {
      Object.keys(categories).forEach((c) => {
        categories[c].forEach(p => this.render(p.path, 'category', this._data(p)))
      })
    }

    if (args.indexOf('tag') > -1) {
      Object.keys(tags).forEach((t) => {
        tags[t].forEach(p => this.render(p.path, 'tag', this._data(p)))
      })
    }

    return Promise.resolve()
  }

  generate(data) {
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

    if (!data.config) {
      this.copySources()
      this._rss.generate(posts)
      return this.genHtmls(data, 'all')
    }

    // generate JSON
    this.renderJson('config.json', data.config)
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

    return Promise.resolve()
  }
 }

module.exports = Generator
