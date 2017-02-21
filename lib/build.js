const render = require('./render')
const pathFn = require('path')
const templates = require('./template')
const helperFn = require('./helper')

function Build(data) {
  const config = global.config
  const template = templates()
  const { pages, posts } = data
  const { index, archives, categories, tags } = data.paginations
  const categoriesParh = pathFn.join(config.category_dir, 'index.html')
  const tagsPath = pathFn.join(config.tag_dir, 'index.html')
  const helper = helperFn()

  pages.forEach(page => render(page.path, template.page, Object.assign({ page }, helper)))
  posts.forEach(page => render(page.path, template.post, Object.assign({ page }, helper)))
  index.forEach(page => render(page.path, template.index, Object.assign({ page }, helper)))
  archives.forEach(page => render(page.path, template.archives, Object.assign({ page }, helper)))

  render(categoriesParh, template.categories, Object.assign({ page: data.categories }, helper))
  render(tagsPath, template.tags, Object.assign({ page: data.tags }, helper))

  Object.keys(categories).forEach((category) => {
    categories[category].forEach((page) => {
      const content = Object.assign({ page }, helper)
      render(page.path, template.category, content)
    })
  })

  Object.keys(tags).forEach((tag) => {
    tags[tag].forEach((page) => {
      const content = Object.assign({ page }, helper)
      render(page.path, template.tag, content)
    })
  })
}

module.exports = Build
