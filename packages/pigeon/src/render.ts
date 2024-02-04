import { join } from 'path'
import { AcyOrt } from 'acyort'
import { TemplateData } from './data'
import { getOutputHTML } from './helpers'

export default (data: TemplateData, acyort: AcyOrt) => {
  const {
    home,
    pages,
    posts,
    categories,
    tags,
    archives,
  } = data
  const outputHTML = getOutputHTML(acyort, data.posts)

  posts.forEach((post) => {
    outputHTML('post', post)
  })

  home.forEach((page) => {
    const path = join(page.fullPath, 'index.html')
    outputHTML('home', page, path)
  })

  pages.forEach((page) => {
    outputHTML('page', page)
  })

  archives.forEach((page) => {
    const path = join(page.fullPath, 'index.html')
    outputHTML('archives', page, path)
  })

  categories.forEach((category) => {
    category.pages.forEach((page) => {
      const path = join(page.fullPath, 'index.html')
      outputHTML('category', {
        ...page,
        title: category.title,
        data: posts.filter(({ id }) => page.data.includes(id)),
      }, path)
    })
  })

  tags.forEach((tag) => {
    tag.pages.forEach((page) => {
      const path = join(page.fullPath, 'index.html')
      outputHTML('tag', {
        ...page,
        title: tag.title,
        data: posts.filter(({ id }) => page.data.includes(id)),
      }, path)
    })
  })

  const categoriesPath = '/categories/index.html'
  outputHTML('categories', categories, categoriesPath)

  const tagsPath = '/tags/index.html'
  outputHTML('tags', tags, tagsPath)
}
