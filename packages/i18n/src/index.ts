/* eslint-disable no-underscore-dangle */
import parser, { Locale } from './parser'
import getLocaleData from './locale'

export default class {
  private localesDir: string

  private currentLocale: string

  private localesData: Record<string, Locale>

  constructor(localesDir: string, defaultLocale: string) {
    this.localesDir = localesDir
    this.currentLocale = defaultLocale
    this.localesData = {
      [defaultLocale]: getLocaleData(localesDir, defaultLocale) as Locale,
    }
  }

  set locale(locale: string) {
    this.currentLocale = locale
  }

  get locale() {
    return this.currentLocale
  }

  private parse(type: '_' | 'n', localeKey: string, ...params: any[]) {
    let localeData = this.localesData[this.currentLocale]
    if (!localeData) {
      localeData = getLocaleData(this.localesDir, this.currentLocale) as Locale
      this.localesData[this.currentLocale] = localeData
    }
    return parser(type, localeData, localeKey, ...params)
  }

  public reload() {
    this.localesData = {}
  }

  public __(localeKey: string, ...params: any[]) {
    return this.parse('_', localeKey, ...params)
  }

  public _n(localeKey: string, ...params: any[]) {
    return this.parse('n', localeKey, ...params)
  }
}
