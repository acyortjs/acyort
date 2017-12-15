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

  compile(template) {
    const { base, theme } = this.config
    const dir = pathFn.join(base, 'themes', theme, 'layout')
    const templates = this.tags.map(tag => ({
      tag,
      path: pathFn.join(dir, `${tag}.html`),
    }))

    if (!template || template === 'html') {
      return this.renderer.compile(templates)
    }

    const tpl = templates.find(t => t.tag === template)

    if (tpl) {
      return this.renderer.compile([tpl])
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
    if (type && type !== 'css' || type !== 'static') {
      return false
    }

    const { public_dir, base, theme } = this.config
    const publicDir = pathFn.join(base, public_dir)
    const sourceDir = pathFn.join(base, 'themes', theme, 'source')

    fs.copySync(sourceDir, publicDir)
    return this.logger.success('success copied static files')
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

    this.helper.posts = posts

    if (helpers) {
      Object.keys(helpers).forEach(name => this.helper.add(name, helpers[name]))
    }

    this.source(type)
    this.compile(type)

    if (type === 'i18n') {
      this.helper.resetLocales()
    }

    if (!type || type === 'categories') {
      this.output('categories', this.path('category'), data.categories)
    }

    if (!type || type === 'tags') {
      this.output('tags', this.path('tag'), data.tags)
    }

    if (!type || type === 'page') {
      pages.forEach(p => this.output('page', p.path, p))
    }

    if (!type || type === 'post') {
      posts.forEach(p => this.output('post', p.path, p))
    }

    if (!type || type === 'index') {
      page.forEach(p => this.output('index', p.path, p))
    }

    if (!type || type === 'category') {
      Object.keys(categories).forEach((c) => {
        categories[c].forEach(p => this.output('category', p.path, p))
      })
    }

    if (!type || type === 'tag') {
      Object.keys(tags).forEach((t) => {
        tags[t].forEach(p => this.output('category', p.path, p))
      })
    }

    return Promise.resolve(data)
  }
}

module.exports = Builder
