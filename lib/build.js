const render = require('./render')
const pathFn = require('path')

function Build(data) {
    const config = global.config
    const { pages, posts } = data
    const { index, archives, categories, tags } = data.paginations
    const categoriesParh = pathFn.join(config.category_dir, 'index.html')
    const tagsPath = pathFn.join(config.tag_dir, 'index.html')

    pages.forEach(page => render(page.path, 'page', { page }))
    posts.forEach(page => render(page.path, 'post', { page }))
    //index.forEach(page => render(page.path, 'index', { page }))
    //archives.forEach(page => render(page.path, 'archives', { page }))

/*
    render(categoriesParh, 'categories', { page: data.categories })
    render(tagsPath, 'tags', { page: data.tags })

    Object.keys(categories).forEach((category) => {
        categories[category].forEach(page => render(page.path, 'category', { page }))
    })

    Object.keys(tags).forEach((tag) => {
        tags[tag].forEach(page => render(page.path, 'tag', { page }))
    })
*/
}

module.exports = Build
