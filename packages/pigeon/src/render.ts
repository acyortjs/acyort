/* eslint-disable no-underscore-dangle */
import { writeFileSync } from 'fs'
import { join } from 'path'
import { AcyOrt } from 'acyort'
import { Config } from '@acyort/pigeon'
import swig from 'swig-templates'
import { TemplateData } from './data'
import getTemplate from './template'
import { getI18n, getTimer, getUrl } from './helpers'

export default (data: TemplateData, acyort: AcyOrt) => {
  const config = acyort.config as Config
  const i18n = getI18n(acyort)
  const {
    home,
    pages,
    posts,
    categories,
    tags,
    archives,
  } = data
  const templatePath = `${getTemplate(acyort)}/views`
  const templateNames = {
    post: `${templatePath}/post.html`,
    page: `${templatePath}/page.html`,
    home: `${templatePath}/home.html`,
    categories: `${templatePath}/categories.html`,
    tags: `${templatePath}/tags.html`,
    category: `${templatePath}/category.html`,
    tag: `${templatePath}/tag.html`,
    archives: `${templatePath}/archives.html`,
  }
  const helpers = {
    _url: getUrl(config),
    _time: getTimer(config),
    __: i18n.__,
    _n: i18n._n,
  }
  const outputBasePath = join(acyort.cwd, config.public || '/')

  posts.forEach((post) => {
    const html = swig.renderFile(templateNames.post, { post, ...helpers })
    writeFileSync(join(outputBasePath, post.path), html)
  })

  // home.forEach((page) => {
  //   const path = join(page.fullPath, 'index.html')
  //   const html = swig.renderFile(templateNames.home, page)
  //   writeFileSync(path, html)
  // })

  // pages.forEach((page) => {
  //   const html = swig.renderFile(templateNames.page, page)
  //   writeFileSync(page.path, html)
  // })

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

  // const categoriesPath = '/categories/index.html'
  // const categoriesHtml = swig.renderFile(templateNames.categories, categories)
  // writeFileSync(categoriesPath, categoriesHtml)

  // const tagsPath = '/tags/index.html'
  // const tagsHtml = swig.renderFile(templateNames.tags, tags)
  // writeFileSync(tagsPath, tagsHtml)
}
