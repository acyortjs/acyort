const render = require('./render')
const pathFn = require('path')
const templates = require('./template')

function Build(data) {
    const config = global.config
    const template = templates()
    const { pages, posts } = data
    const { index, archives, categories, tags } = data.paginations
    const categoriesParh = pathFn.join(config.category_dir, 'index.html')
    const tagsPath = pathFn.join(config.tag_dir, 'index.html')

    pages.forEach(page => render(page.path, template.page, { page }))
    posts.forEach(page => render(page.path, template.post, { page }))
    index.forEach(page => render(page.path, template.index, { page }))
    archives.forEach(page => render(page.path, template.archives, { page }))

    render(categoriesParh, template.categories, { page: data.categories })
    render(tagsPath, template.tags, { page: data.tags })

    Object.keys(categories).forEach((category) => {
        categories[category].forEach(page => render(page.path, template.category, { page }))
    })

    Object.keys(tags).forEach((tag) => {
        tags[tag].forEach(page => render(page.path, template.tag, { page }))
    })
}

module.exports = Build
