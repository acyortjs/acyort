const pathFn = require('path')
const fs = require('fs-extra')
const Helper = require('acyort-helper')
const allTags = require('./tags')

class Builder {
  constructor({ config, logger, renderer }) {
    this.config = config
    this.renderer = renderer
    this.helper = new Helper({ config, renderer })
    this.logger = logger
    this.tags = allTags.slice(0)
  }

  data(page) {
    return Object.assign({ page, config: this.config }, this.helper.methods)
  }

  compile(type) {
    const { base, theme } = this.config
    const dir = pathFn.join(base, 'themes', theme, 'layout')
    const templates = this.tags.map(tag => ({
      tag,
      path: pathFn.join(dir, `${tag}.html`),
    }))

    if (!type || type === 'html' || type === 'i18n') {
      return this.renderer.compile(templates)
    }

    const template = templates.find(t => t.tag === type)

    if (template) {
      return this.renderer.compile([template])
    }

    return false
  }

  output(tag, path, page) {
    const { base, public_dir } = this.config
    const data = this.data(page)
    const fileString = this.renderer.render('swig', { tag, data })

    if (fileString) {
      fs.outputFileSync(pathFn.join(base, public_dir, path), fileString)
      this.logger.success(path)
    }
  }

  path(tag) {
    return pathFn.join(this.config[`${tag}_dir`], 'index.html')
  }

  source(type) {
    const { public_dir, base, theme } = this.config
    const publicDir = pathFn.join(base, public_dir)
    const sourceDir = pathFn.join(base, 'themes', theme, 'source')

    if (!type || type === 'css' || type === 'static') {
      fs.copySync(sourceDir, publicDir)
      this.logger.success('success copied static files')
    }
  }

  build({ data, helpers, type }) {
    const {
      pages,
      posts,
      paginations: {
        page,
        categories,
        tags,
      },
    } = data

    let current = type

    this.helper.posts = posts

    Object.keys(helpers).forEach(name => this.helper.add(name, helpers[name]))

    this.source(current)
    this.compile(current)

    if (current === 'i18n') {
      this.helper.resetLocales()
    }

    if (current === 'html' || current === 'i18n') {
      current = undefined
    }

    if (!current || current === 'categories') {
      this.output('categories', this.path('category'), data.categories)
    }

    if (!current || current === 'tags') {
      this.output('tags', this.path('tag'), data.tags)
    }

    if (!current || current === 'page') {
      pages.forEach(p => this.output('page', p.path, p))
    }

    if (!current || current === 'post') {
      posts.forEach(p => this.output('post', p.path, p))
    }

    if (!current || current === 'index') {
      page.forEach(p => this.output('index', p.path, p))
    }

    if (!current || current === 'category') {
      Object.keys(categories).forEach((c) => {
        categories[c].forEach(p => this.output('category', p.path, p))
      })
    }

    if (!current || current === 'tag') {
      Object.keys(tags).forEach((t) => {
        tags[t].forEach(p => this.output('tag', p.path, p))
      })
    }

    return Promise.resolve(data)
  }
}

module.exports = Builder
