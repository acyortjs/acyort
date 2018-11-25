const assert = require('power-assert')
const { resolve } = require('path')
const Helper = require('../lib/helper')

describe('helper', () => {
  it('test', () => {
    const config = {
      base: resolve(__dirname, '../assets'),
      template: 'ccc45',
      language: 'en',
      root: '/',
      timezone: 'UTC',
    }
    const helper = new Helper(config)
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

    helper.register('test', () => 'b')
    assert(helper.methods.test() === 'a')

    helper.register('test0', 'no a function')
    assert(helper.methods.test0 === undefined)
  })
})
