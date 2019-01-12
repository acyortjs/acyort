const { writeFileSync, removeSync, ensureDirSync } = require('fs-extra')
const { join } = require('path')
const assert = require('power-assert')
const getConfig = require('../lib/config')

const config0 = 'url:'
const config1 = 'url: https://test.com/public'
const config2 = 'url: test.com'
const config3 = 'template: npm'

describe('config', () => {
  const base = join(__dirname, 'fixtures')

  afterEach(() => {
    removeSync(join(base, 'config.yml'))
    removeSync(join(base, 'node_modules'))
  })

  it('test', () => {
    let config

    writeFileSync(join(base, 'config.yml'), config0)
    config = getConfig(base)

    assert(config.url === 'https://acyort.com')
    assert(config.root === '/')

    writeFileSync(join(base, 'config.yml'), config1)
    config = getConfig(base)

    assert(config.url === 'https://test.com')
    assert(config.root === '/public')

    writeFileSync(join(base, 'config.yml'), config2)
    config = getConfig(base)

    assert(config.url === 'https://acyort.com')
    assert(config.root === '/')

    writeFileSync(join(base, 'config.yml'), config3)
    config = getConfig(base)

    assert(config.templatePath === undefined)

    ensureDirSync(join(base, 'node_modules', 'npm', 'templates', 'npm'))
    config = getConfig(base)
    assert(config.templatePath === join(base, 'node_modules', 'npm', 'templates', 'npm'))

    config = getConfig()
    assert(config === null)
  })
})
