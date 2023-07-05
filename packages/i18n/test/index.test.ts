import { join } from 'path'
import I18n from '../src'

describe('i18n', () => {
  it('cases', () => {
    const i18n = new I18n(join(__dirname, 'locales'), 'default')
    expect(i18n.locale).toBe('default')
  })
})
