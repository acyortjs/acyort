const assert = require('power-assert')
const { resolve } = require('path')
const fs = require('fs-extra')
const {
  existsSync, readFileSync, removeSync,
} = require('fs-extra')
const Renderer = require('@acyort/renderer')
const logger = require('@acyort/logger')()
const outputHTML = require('../../lib/utility/output')

const resolveDir = (...paths) => resolve(__dirname, ...paths)

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
  })
})

describe('output with node_modules', () => {
  const templateName = 'mock-acyort-template'
  const templatePath = `../../node_modules/${templateName}`
  beforeEach(() => {
    fs.copySync(resolveDir(`../fixtures/${templateName}`), resolveDir(templatePath))
  })
  afterEach(() => {
    removeSync(resolveDir(templatePath))
    removeSync(resolve(__dirname, '../fixtures/temp'))
  })
  const acy = {
    ...acyort,
    config: {
      ...config,
      template: templateName,
    },
  }
  it('template from node_module', () => {
    outputHTML.call(acy, {
      template: 'index',
      path: 'index.html',
      data: {
        one: 2,
      },
    })
    assert(readFileSync(resolve(__dirname, '../fixtures/temp/index.html'), 'utf8') === '<p>from module: This is not h2</p>\n')
  })
  it('template from node_module and use entry', () => {
    const indexPath = resolveDir(templatePath)
    fs.renameSync(`${indexPath}/_index.js`, `${indexPath}/index.js`)
    fs.renameSync(`${indexPath}/templates`, `${indexPath}/test`)
    outputHTML.call(acy, {
      template: 'index',
      path: 'index.html',
      data: {
        one: 2,
      },
    })
    assert(readFileSync(resolve(__dirname, '../fixtures/temp/index.html'), 'utf8') === '<p>from module: This is not h2</p>\n')
  })
  it('template from node_module and entry not found', () => {
    const indexPath = resolveDir(templatePath)
    fs.renameSync(`${indexPath}/_index.js`, `${indexPath}/index.js`)
    outputHTML.call(acy, {
      template: 'index',
      path: 'index.html',
      data: {
        one: 2,
      },
    })
    assert(existsSync(resolve(__dirname, '../fixtures/temp/index.html')) === false)
  })
})
