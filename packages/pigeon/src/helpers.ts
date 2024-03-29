/* eslint-disable no-underscore-dangle */
import { TimeLike, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import swig from 'swig-templates'
import moment from 'moment'
import momentTz from 'moment-timezone'
import { Config } from '@acyort/pigeon'
import { AcyOrt } from 'acyort'
import I18n from '@acyort/i18n'
import getTemplate from './template'
import type { TemplateData } from './data'

interface PostsQuery {
  tag?: string,
  category?: string,
}

export const getTimer = (config: Config) => {
  const {
    language = 'en',
    timezone = moment.tz.guess(),
  } = config

  return (time: TimeLike, format: string) => momentTz(moment(time)
    .locale(language), timezone)
    .format(format)
}

const getUrl = (config: Config) => {
  const { root: rootPath = '/' } = config
  return (path?: string) => join(rootPath, path?.toLowerCase() || '')
}

const getI18n = (acyort: AcyOrt) => {
  const { language = 'en' } = acyort.config as Config
  const templatePath = getTemplate(acyort)
  const localePath = join(templatePath, 'i18n')

  return new I18n(localePath, language)
}

const writeFileSyncRecursive = (filename: string, content: string) => {
  mkdirSync(dirname(filename), { recursive: true })
  writeFileSync(filename, content)
}

export const getOutputHTML = (acyort: AcyOrt, posts: TemplateData['posts']) => {
  const { cwd, config } = acyort
  const { public: publicDir = '/' } = config as Config
  const outputBasePath = join(cwd, publicDir)

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

  const i18n = getI18n(acyort)
  const helpers = {
    _url: getUrl(config as Config),
    _time: getTimer(config as Config),
    __: i18n.__,
    _n: i18n._n,
    _post: (id: number) => posts.find((p) => p.id === id),
    _posts: (query?: PostsQuery) => {
      if (!query) {
        return posts
      }
      if (query.tag) {
        return posts.filter((p) => p.tags.map((t) => t.title).includes(query.tag!))
      }
      if (query.category) {
        return posts.filter((p) => p.category?.title === query.category)
      }
      return []
    },
  }
  const extraData = { ...helpers, config }

  swig.setDefaults({
    cache: false,
    autoescape: false,
  })

  return (templateName: keyof typeof templateNames, data: any, htmlPath?: string) => {
    const html = swig.renderFile(templateNames[templateName], { page: data, ...extraData })
    writeFileSyncRecursive(join(outputBasePath, htmlPath || data.path), html)
    acyort.logger.success(htmlPath || data.path)
  }
}
