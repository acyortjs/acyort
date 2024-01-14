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

export const getOutputHTML = (acyort: AcyOrt) => {
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
  }
  const extraData = { ...helpers, config }

  return (templateName: keyof typeof templateNames, data: any, htmlPath?: string) => {
    const html = swig.renderFile(templateNames[templateName], { page: data, ...extraData })
    writeFileSyncRecursive(join(outputBasePath, htmlPath || data.path), html)
    acyort.logger.success(htmlPath || data.path)
  }
}
