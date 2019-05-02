const { removeSync, outputFileSync, ensureDirSync } = require('fs-extra')
const { join, resolve } = require('path')
const assert = require('power-assert')
const expect = require('expect')
const getConfig = require('../lib/config/get')

const config0 = 'url:'
const config1 = 'url: https://test.com/public'
const config2 = 'url: test.com'
const config3 = 'template: npm'
const config4 = 'url: \'\''

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

    outputFileSync(join(base, 'config.yml'), config4)
    config = getConfig(base)

    assert(config.url === '')
    assert(config.root === '/')

    outputFileSync(join(base, 'config.yml'), config3)

    expect(() => { config = getConfig(base) })
      .toThrow('Template no exist: npm')

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

    expect(() => { config = getConfig(base) })
      .toThrow('Template no exist: npm')

    config = getConfig('.')
    assert(config === null)
  })
})
describe('test config width arg', () => {
  let config
  it('test default config', () => {
    expect(getConfig).toThrow('Template no exist: ccc45')
  })
  it('test custom config', () => {
    const url = 'http://abc.xyz'
    const root = 'rootPath'
    const now = Date.now()
    const template = `acyort-template-${now}`
    const npmPath = join(__dirname, '..', 'node_modules', template)
    ensureDirSync(join(npmPath, 'templates', 'ccc45'))
    outputFileSync(
      join(npmPath, 'package.json'),
      JSON.stringify({
        name: 'npm',
        version: '0.1.0',
        main: 'index.js',
      }),
    )
    outputFileSync(
      join(npmPath, 'index.js'),
      "module.exports.template = 'ccc45'",
    )
    config = getConfig({
      base: '.',
      url: `${url}/${root}`,
      template,
    })
    removeSync(npmPath)
    assert(config.base === resolve('.'))
    assert(config.url === url)
    assert(config.root === `/${root}`)
    assert(config.templatePath === join(npmPath, 'templates', 'ccc45'))
  })
})
