import { sprintf } from 'sprintf-js'
import signale from 'signale'

export type Locale = {
  [key: string]: Locale | string
}

export default (
  type: '_' | 'n',
  localeData: Locale,
  localeKey: string,
  ...params: any[]
) => {
  try {
    let phrase: Locale | string | undefined

    localeKey.split('.').forEach((key) => {
      phrase = phrase ? (phrase as Locale)[key] : localeData[key]
    })

    if (!phrase) {
      signale.warn({
        prefix: '[i18n]',
        message: 'Cannot get locale data',
        suffix: localeKey,
      })
      return ''
    }

    if (type === '_') {
      return sprintf(phrase as string, ...params)
    }

    const count = Number(params[0])
    const final = phrase as Locale

    if (count === 0) {
      return sprintf(final.zero as string, ...params)
    }

    if (count === 1) {
      return sprintf(final.one as string, ...params)
    }

    return sprintf(final.other as string, ...params)
  } catch (e) {
    signale.fatal({ prefix: '[i18n]', message: e })
    return ''
  }
}
