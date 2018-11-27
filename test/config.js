const { writeFileSync } = require('fs-extra')
const { join } = require('path')
const assert = require('power-assert')
const getConfig = require('../lib/config')

const config0 = 'url:'
const config1 = 'url: https://test.com/public'
const config2 = 'url: test.com'

describe('config', () => {
  it('test', () => {
    const base = join(__dirname, 'fixtures')
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

    config = getConfig()

    assert(config === null)
  })
})
