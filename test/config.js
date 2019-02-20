const { removeSync, outputFileSync, ensureDirSync } = require('fs-extra')
const { join } = require('path')
const assert = require('power-assert')
const getConfig = require('../lib/config')
const defaultConfig = require('../lib/config/defaults')

const config0 = 'url:'
const config1 = 'url: https://test.com/public'
const config2 = 'url: test.com'
const config3 = 'template: npm'

describe('test config with config.yml', () => {
  const base = join(__dirname, 'fixtures')

  afterEach(() => {
    removeSync(join(base, 'config.yml'))
    removeSync(join(base, 'node_modules'))
    const requireKey = Object.keys(require.cache).find(s => s.includes('npm'))
    delete require.cache[requireKey]
  })

  it('test config', () => {
    let config

    outputFileSync(join(base, 'config.yml'), config0)
    config = getConfig(base)

    assert(config.url === 'https://acyort.com')
    assert(config.root === '/')

    outputFileSync(join(base, 'config.yml'), config1)
    config = getConfig(base)

    assert(config.url === 'https://test.com')
    assert(config.root === '/public')

    outputFileSync(join(base, 'config.yml'), config2)
    config = getConfig(base)

    assert(config.url === 'https://acyort.com')
    assert(config.root === '/')

    outputFileSync(join(base, 'config.yml'), config3)
    config = getConfig(base)

    assert(config.templatePath === undefined)

    ensureDirSync(join(base, 'node_modules', 'npm', 'templates', 'ccc45'))
    outputFileSync(
      join(base, 'node_modules', 'npm', 'package.json'),
      JSON.stringify({
        name: 'npm',
        version: '0.1.0',
        main: 'index.js',
      }),
    )
    outputFileSync(
      join(base, 'node_modules', 'npm', 'index.js'),
      "module.exports.template = 'ccc45'",
    )
    config = getConfig(base)
    assert(
      config.templatePath
        === join(base, 'node_modules', 'npm', 'templates', 'ccc45'),
    )

    removeSync(join(base, 'node_modules', 'npm', 'index.js'))
    outputFileSync(
      join(base, 'node_modules', 'npm', 'index.js'),
      'module.exports.template = undefined',
    )

    // delete require cache
    const requireKey = Object.keys(require.cache).find(s => s.includes('npm'))
    delete require.cache[requireKey]

    config = getConfig(base)
    assert(config.templatePath === undefined)

    config = getConfig()
    assert(config === null)
  })
})
describe('test config width arg', () => {
  let config
  it('test', () => {
    config = getConfig({})
    console.log(config)
    const base = process.cwd()
  })
})
