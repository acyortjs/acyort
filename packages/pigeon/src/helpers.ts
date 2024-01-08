import { TimeLike } from 'fs'
import { join } from 'path'
import moment from 'moment'
import momentTz from 'moment-timezone'
import { Config } from '@acyort/pigeon'
import { AcyOrt } from 'acyort'
import I18n from '@acyort/i18n'
import getTrmplate from './template'

export const getTimer = (config: Config) => {
  const {
    language = 'en',
    timezone = moment.tz.guess(),
  } = config

  return (time: TimeLike, format: string) => momentTz(moment(time)
    .locale(language), timezone)
    .format(format)
}

export const getUrl = (config: Config) => {
  const { public: publicPath = '/' } = config
  return (path?: string) => join(publicPath, path?.toLowerCase() || '')
}

export const getI18n = (acyort: AcyOrt) => {
  const { language = 'en' } = acyort.config as Config
  const templatePath = getTrmplate(acyort)
  const localePath = join(templatePath, 'i18n')

  return new I18n(localePath, language)
}
