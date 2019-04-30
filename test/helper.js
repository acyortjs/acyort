const assert = require('power-assert')
const expect = require('expect')
const { join } = require('path')
const Helper = require('../lib/helper')

describe('helper', () => {
  it('test', () => {
    const config = {
      base: join(__dirname, 'fixtures'),
      template: 'ccc45',
      language: 'en',
      root: '/',
      timezone: 'UTC',
      templatePath: join(__dirname, 'fixtures', 'templates', 'ccc45'),
    }
    let helper = new Helper(config)
    const {
      __,
      _n,
      _url,
      _time,
    } = helper.methods

    assert(__('h1', 'O', 'K') === 'O K')
    assert(_n('number', 0) === '0')
    assert(_url('/post') === '/post')
    assert(_url() === '/')
    assert(_time(1543141780476, 'YYYY MM DD') === '2018 11 25')

    helper.register('test', () => 'a')
    assert(helper.methods.test() === 'a')

    expect(() => helper.register('test', () => 'b'))
      .toThrow('Helper function register error: test, duplicate name or no a function')

    expect(() => helper.register('test0', 'no a function'))
      .toThrow('Helper function register error: test0, duplicate name or no a function')

    helper.language = 'zh_CN'
    assert(_time(1543141780476, 'MMMM Do YYYY, h:mm:ss a').includes('十一月 25日 2018') === true)
    assert(helper.language === 'zh_CN')
    assert(helper.__('test') === '') // eslint-disable-line no-underscore-dangle
    assert(typeof helper.getHelper('__') === 'function')
    assert(helper.getHelper('_') === undefined)

    config.templatePath = undefined
    helper = new Helper(config)
    assert(helper.__('h1', 'O', 'K') === '') // eslint-disable-line no-underscore-dangle
  })
})
