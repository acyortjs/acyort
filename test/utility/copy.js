const assert = require('power-assert')
const { resolve, join } = require('path')
const { existsSync, removeSync } = require('fs-extra')
const copySource = require('../../lib/utility/copy')
const logger = require('../../lib/logger')

const acyort = {
  logger,
  config: {
    public: 'temp',
    base: resolve(__dirname, '../fixtures'),
    template: 'ccc45',
    templatePath: join(resolve(__dirname, '../fixtures'), 'templates', 'ccc45'),
  },
}

describe('copy', () => {
  it('test', () => {
    copySource.call(acyort)
    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === true)

    removeSync(resolve(__dirname, '../fixtures/temp'))

    acyort.config.templatePath = 'no exist'
    copySource.call(acyort)

    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === false)

    acyort.config.templatePath = undefined
    copySource.call(acyort)

    assert(existsSync(resolve(__dirname, '../fixtures/temp/favicon.ico')) === false)
  })
})
