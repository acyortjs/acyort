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
  const outputHTML = getOutputHTML(acyort)

  posts.forEach((post) => {
    outputHTML('post', post)
  })

  // home.forEach((page) => {
  //   const path = join(page.fullPath, 'index.html')
  //   const html = swig.renderFile(templateNames.home, page)
  //   writeFileSync(path, html)
  // })

  pages.forEach((page) => {
    outputHTML('page', page)
  })

  // archives.forEach((page) => {
  //   const path = join(page.fullPath, 'index.html')
  //   const html = swig.renderFile(templateNames.archives, page)
  //   writeFileSync(path, html)
  // })

  // categories.forEach((category) => {
  //   category.pages.forEach((page) => {
  //     const path = join(page.fullPath, 'index.html')
  //     const html = swig.renderFile(templateNames.category, {
  //       ...page,
  //       posts: posts.filter(({ id }) => page.data.includes(id)),
  //     })
  //     writeFileSync(path, html)
  //   })
  // })

  // tags.forEach((tag) => {
  //   tag.pages.forEach((page) => {
  //     const path = join(page.fullPath, 'index.html')
  //     const html = swig.renderFile(templateNames.tag, {
  //       ...page,
  //       posts: posts.filter(({ id }) => page.data.includes(id)),
  //     })
  //     writeFileSync(path, html)
  //   })
  // })

  const categoriesPath = '/categories/index.html'
  outputHTML('categories', { categories }, categoriesPath)

  const tagsPath = '/tags/index.html'
  outputHTML('tags', { tags }, tagsPath)
}
