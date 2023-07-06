/* eslint-disable no-underscore-dangle */
import { join } from 'path'
import I18n from '../src'

describe('i18n', () => {
  it('cases', () => {
    const i18n = new I18n(join(__dirname, 'locales'), 'default')

    expect(i18n.locale).toBe('default')

    expect(i18n.__('three', 'aaaa')).toBe('Hello aaaa')
    expect(i18n.__('a.b.c', 'aaaa', 'bbbb')).toBe('sbbbb a aaaa')
    expect(i18n._n('num', 0)).toBe('not cats')
    expect(i18n._n('num', 1)).toBe('only one cats')
    expect(i18n._n('num', 1000)).toBe('is 1000 cats')

    expect(i18n._n('error', 1000)).toBe('')

    i18n.locale = 'en'

    expect(i18n.__('three', 'aaaa')).toBe('')
    expect(i18n.__('one', 'aaaa')).toBe('')

    i18n.reload()
    // @ts-ignore
    const data = i18n.localesData
    expect(Object.keys(data).length).toBe(0)

    i18n.locale = 'zh'
    expect(i18n.__('one', 'aaaa')).toBe('')
  })
})
