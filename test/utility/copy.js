const assert = require('power-assert')
const { resolve } = require('path')
const logger = require('@acyort/logger')()
const fs = require('fs-extra')
const { existsSync, removeSync } = require('fs-extra')
const copySource = require('../../lib/utility/copy')

const acyort = {
  logger,
  config: {
    public: 'temp',
    base: resolve(__dirname, '../fixtures'),
    template: 'ccc45',
  },
}

describe('copy', () => {
  it('test', () => {
    copySource.call(acyort)
    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === true)

    removeSync(resolve(__dirname, '../fixtures/temp'))

    acyort.config.template = 'unknow'
    copySource.call(acyort)

    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === false)
  })
})

const resolveDir = (...paths) => resolve(__dirname, ...paths)

describe('copy source from module', () => {
  const templateName = 'mock-acyort-template'
  const templatePath = `../../node_modules/${templateName}-1`
  beforeEach(() => {
    fs.copySync(resolveDir(`../fixtures/${templateName}`), resolveDir(templatePath))
  })
  afterEach(() => {
    removeSync(resolve(__dirname, '../fixtures/temp'))
    removeSync(resolveDir(templatePath))
  })
  const acy = {
    ...acyort,
    config: {
      ...acyort.config,
      template: `${templateName}-1`,
    },
  }
  it('copy from module', () => {
    copySource.call(acy)
    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === true)
  })
  it('copy from module and use entry', () => {
    const indexPath = resolveDir(templatePath)
    fs.renameSync(`${indexPath}/_index.js`, `${indexPath}/index.js`)
    fs.renameSync(`${indexPath}/templates`, `${indexPath}/test`)
    copySource.call(acy)
    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === true)
  })
  it('copy from module and entry not found', () => {
    const indexPath = resolveDir(templatePath)
    fs.renameSync(`${indexPath}/_index.js`, `${indexPath}/index.js`)
    copySource.call(acy)
    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === false)
  })
})
