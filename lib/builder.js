const pathFn = require('path')
const fs = require('fs-extra')

class Builder {
  constructor(acyort) {
    this.config = acyort.config
    this.renderer = acyort.renderer
    this.helper = acyort.helper
    this.logger = acyort.logger
    this.template = acyort.template
  }

  data(page) {
    return Object.assign({ page, config: this.config }, this.helper.methods)
  }

  path(tag) {
    return pathFn.join(this.config[`${tag}_dir`], 'index.html')
  }

  output(tag, path, page) {
    const {
      base,
      public_dir: publicDir,
      layout_dir: layoutDir,
      theme,
    } = this.config
    const template = pathFn.join(base, 'themes', theme, layoutDir, `${tag}.${this.template.ext}`)

    if (fs.existsSync(template)) {
      const data = this.data(page)
      const file = this.renderer.renderFile(template, data)
      fs.outputFileSync(pathFn.join(base, publicDir, path), file)
      this.logger.success(path, 'builder')
    }
  }

  source(type) {
    const {
      public_dir: publicDir,
      base,
      theme,
      source_dir: sourceDir,
    } = this.config
    const publics = pathFn.join(base, publicDir)
    const sources = pathFn.join(base, 'themes', theme, sourceDir)

    if (!type || type === 'css' || type === 'static') {
      if (fs.existsSync(sources) && fs.readdirSync(sources).length > 0) {
        fs.copySync(sources, publics)
        this.logger.success('Success copied static files', 'source')
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

    this.source(type)

    let current = type

    if (current === 'i18n') {
      this.helper.resetLocale()
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
