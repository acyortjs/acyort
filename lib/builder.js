const pathFn = require('path')
const fs = require('fs-extra')
const Logger = require('acyort-logger')
const Render = require('acyort-render')
const allTags = require('./tags')

class Builder {
  constructor(config, helper) {
    this.config = config
    this.renderer = new Render()
    this.helper = helper
    this.logger = new Logger()
    this.tags = allTags.slice(0)
  }

  data(page) {
    return Object.assign({ page, config: this.config }, this.helper.methods)
  }

  compile(type) {
    const {
      base,
      theme,
      layout_dir,
    } = this.config
    const layoutDir = pathFn.join(base, 'themes', theme, layout_dir)
    const templates = this.tags
      .map(tag => ({
        tag,
        path: pathFn.join(layoutDir, `${tag}.html`),
      }))
      .filter(({ path }) => fs.existsSync(path))

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
    const {
      public_dir,
      base,
      theme,
      source_dir,
    } = this.config
    const publicDir = pathFn.join(base, public_dir)
    const sourceDir = pathFn.join(base, 'themes', theme, source_dir)

    if (!type || type === 'css' || type === 'static') {
      if (fs.existsSync(sourceDir) && fs.readdirSync(sourceDir).length > 0) {
        fs.copySync(sourceDir, publicDir)
        this.logger.success('Success copied static files')
      }
    }
  }

  build({ data, type }) {
    const {
      pages,
      posts,
      categories,
      tags,
      index,
      category,
      tag,
    } = data

    let current = type

    this.helper.postsData = posts
    this.source(current)
    this.compile(current)

    if (current === 'i18n') {
      this.helper.resetLocales()
    }

    if (current === 'html' || current === 'i18n') {
      current = undefined
    }

    if (!current || current === 'categories') {
      this.output('categories', this.path('category'), categories)
    }

    if (!current || current === 'tags') {
      this.output('tags', this.path('tag'), tags)
    }

    if (!current || current === 'page') {
      pages.forEach(p => this.output('page', p.path, p))
    }

    if (!current || current === 'post') {
      posts.forEach(p => this.output('post', p.path, p))
    }

    if (!current || current === 'index') {
      index.forEach(p => this.output('index', p.path, p))
    }

    if (!current || current === 'category') {
      Object.keys(category).forEach((c) => {
        category[c].forEach(p => this.output('category', p.path, p))
      })
    }

    if (!current || current === 'tag') {
      Object.keys(tag).forEach((t) => {
        tag[t].forEach(p => this.output('tag', p.path, p))
      })
    }

    return Promise.resolve(data)
  }
}

module.exports = Builder
