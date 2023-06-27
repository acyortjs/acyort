export default class {
  private localesDir: string

  private currentLocale: string

  constructor(localesDir: string, defaultLocale: string) {
    this.localesDir = localesDir
    this.currentLocale = defaultLocale
  }

  set locale(locale: string) {
    this.currentLocale = locale
  }

  get locale() {
    return this.currentLocale
  }
}
