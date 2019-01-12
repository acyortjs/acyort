const assert = require('power-assert')
const { resolve, join } = require('path')
const { existsSync, readFileSync, removeSync } = require('fs-extra')
const Renderer = require('@acyort/renderer')
const logger = require('@acyort/logger')()
const outputHTML = require('../../lib/utility/output')

class Helper {
  constructor() {
    this.methods = {
      __: () => null,
    }
    this.defaultMethods = ['__']
  }

  register(name, fn) {
    this.methods[name] = fn
  }
}

const config = {
  public: 'temp',
  base: resolve(__dirname, '../fixtures'),
  template: 'ccc45',
  templatePath: join(resolve(__dirname, '../fixtures'), 'templates', 'ccc45'),
}

const acyort = {
  config,
  logger,
  renderer: new Renderer(),
  helper: new Helper(),
}

acyort.helper.register('_h5', function h5() {
  const number = this.one
  return `This is not h${number}`
})

describe('output', () => {
  afterEach(() => removeSync(resolve(__dirname, '../fixtures/temp')))

  it('test', () => {
    outputHTML.call(acyort, {
      template: 'index',
      path: 'index.html',
      data: {
        one: 1,
      },
    })
    assert(readFileSync(resolve(__dirname, '../fixtures/temp/index.html'), 'utf8') === '<p>This is not h1</p>\n')

    outputHTML.call(acyort, {
      template: 'index',
      path: 'index.html',
      data: {
        one: 2,
      },
    })
    assert(readFileSync(resolve(__dirname, '../fixtures/temp/index.html'), 'utf8') === '<p>This is not h2</p>\n')

    outputHTML.call(acyort, {
      template: 'test',
      path: 'test.html',
      data: {
        one: 1,
      },
    })
    assert(existsSync(resolve(__dirname, '../fixtures/temp/test.html')) === false)

    config.templatePath = undefined
    outputHTML.call(acyort, {
      template: 'index',
      path: 'index2.html',
      data: {
        one: 2,
      },
    })
    assert(existsSync(resolve(__dirname, '../fixtures/temp/index2.html')) === false)
  })
})
