const assert = require('power-assert')
const { resolve, join } = require('path')
const { existsSync, removeSync } = require('fs-extra')
const copySource = require('../../lib/utility/copy')

const config = {
  public: 'temp',
  base: resolve(__dirname, '../fixtures'),
  template: 'ccc45',
  templatePath: join(resolve(__dirname, '../fixtures'), 'templates', 'ccc45'),
}

const acyort = {
  logger: {
    success: () => null,
  },
  config: {
    get() {
      return config
    },
  },
}

describe('copy', () => {
  it('test', () => {
    copySource.call(acyort)
    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === true)

    removeSync(resolve(__dirname, '../fixtures/temp'))

    config.templatePath = 'no exist'
    copySource.call(acyort)

    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === false)

    config.templatePath = undefined
    copySource.call(acyort)

    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === false)
  })
})
