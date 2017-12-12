const pathFn = require('path')
const fs = require('fs-extra')
const Logger = require('acyort-logger')
const Helper = require('acyort-helper')

class Generator {
  constructor({ config, renderer }) {
    this.config = config
    this.renderer = renderer
    this.helper = new Helper({ config, renderer })
    this.logger = new Logger()
    this.tags = 'index,archives,categories,category,page,post,tag,tags'.split(',')
  }

  data(page) {
    return Object.assign({ page }, this.helper.methods)
  }

  compile() {
    const { base, theme } = this.config
    const dir = pathFn.join(base, 'themes', theme, 'layout')
    const templates = this.tags.map(tag => {
      tag,
      path: pathFn.join(dir, `${tag}.html`),
    })

    this.renderer.compile(templates)
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

  source() {
    const { public_dir, base, theme } = this.config
    const publicDir = pathFn.join(base, public_dir)
    const sourceDir = pathFn.join(base, 'themes', theme, 'source')

    fs.copySync(this.sourceDir, this.publicDir)
    this.logger.success('success copied static files')
  }

  generate(data, helpers) {
    const {
      pages,
      posts,
      paginations: {
        page,
        categories,
        tags,
      },
    } = data

    Object.keys(helpers).forEach(name => this.helper.add(name, helpers[name]))

    this.helper.posts = posts

    this.source()
    this.compile()

    this.output('categories', this.path('category'), data.categories)
    this.output('tags', this.path('tag'), data.tags)

    pages.forEach(p => this.output('page', p.path, p))
    posts.forEach(p => this.output('post', p.path, p))
    page.forEach(p => this.output('index', p.path, p))

    Object.keys(categories).forEach((c) => {
      categories[c].forEach(p => this.output('category', p.path, p))
    })
    Object.keys(tags).forEach((t) => {
      tags[t].forEach(p => this.output('category', p.path, p))
    })

    return Promise.reslove(data)
  }
}

module.exports = Generator
