const assert = require('power-assert')
const fs = require('fs-extra')
const sinon = require('sinon')
const pathFn = require('path')
const getConfig = require('acyort-config')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const Acyort = require('../lib/acyort')

const i18nTpl = require('./fixtures/i18n')
const categoriesTpl = require('./fixtures/categories')
const layoutTpl = require('./fixtures/layout')
const styleTpl = require('./fixtures/style')
const headerTpl = require('./fixtures/header')

const throwTpl = require('./fixtures/throw')
const tagTpl = require('./fixtures/tag')

const base = pathFn.resolve(__dirname, '../assets')

String.prototype.trim = function() {
  return this.replace(/\n/g, '')
}

function dir(path) {
  return pathFn.join(base, path)
}

function sleep(t = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}

function getBodyStyle() {
  const body = document.querySelector('body');
  return (JSON.parse(JSON.stringify(getComputedStyle(body)))).backgroundColor
}

function text(path, tag) {
  const html = fs.readFileSync(dir(path))
  const $ = cheerio.load(html)
  return $(tag).text().trim()
}

const config = getConfig(base)
const themeDir = pathFn.join(base, 'themes', config.theme)

const origin = {
  i18n: fs.readFileSync(`${themeDir}/i18n/${config.language}.yml`),
  style: fs.readFileSync(`${themeDir}/source/css/style.css`),
  layout: fs.readFileSync(`${themeDir}/layout/layout.html`),
  categories: fs.readFileSync(`${themeDir}/layout/categories.html`),
  header: fs.readFileSync(`${themeDir}/layout/partials/header.html`),
}

config.cache = true

describe('acyort', () => {
  it('source dir miss', async function () {
    this.timeout(10000)

    const _config = JSON.parse(JSON.stringify(config))
    _config.source_dir = 'error'

    let acyort = new Acyort(_config)
    await acyort.build()

    assert(fs.existsSync(dir('css')) === false)
    assert(fs.existsSync(dir('images')) === false)

    fs.ensureDirSync(`${themeDir}/new`)
    _config.source_dir = 'new'

    acyort = new Acyort(_config)
    await acyort.build()

    assert(fs.existsSync(dir('css')) === false)
    assert(fs.existsSync(dir('images')) === false)

    fs.removeSync(`${themeDir}/new`)
  })

  it('plugins', async function () {
    this.timeout(10000)

    fs.writeFileSync(`${dir('scripts/throw.js')}`, throwTpl)

    const _config = JSON.parse(JSON.stringify(config))
    _config.scripts = ['throw.js']
    let acyort = new Acyort(_config)

    const spy = sinon.spy(acyort.logger, 'error')
    await acyort.build()
    assert(spy.calledWith(spy.args[0][0]) === true)

    fs.writeFileSync(`${dir('scripts/tag.js')}`, tagTpl)
    fs.removeSync(`${themeDir}/layout/categories.html`)
    fs.removeSync(`${dir('categories/index.html')}`)

    _config.scripts = ['tag.js']
    acyort = new Acyort(_config)
    await acyort.build()
    assert(acyort.templates.length === 8)
    assert(fs.existsSync(dir('categories/index.html')) === false)

    fs.removeSync(`${dir('scripts/throw.js')}`)
    fs.removeSync(`${dir('scripts/tag.js')}`)
    fs.writeFileSync(`${themeDir}/layout/categories.html`, origin.categories)
  })

  it('server', async function () {
    this.timeout(20000)

    after(function () {
      fs.writeFileSync(`${themeDir}/i18n/${config.language}.yml`, origin.i18n)
      fs.writeFileSync(`${themeDir}/source/css/style.css`, origin.style)
      fs.writeFileSync(`${themeDir}/layout/layout.html`, origin.layout)
      fs.writeFileSync(`${themeDir}/layout/categories.html`, origin.categories)
      fs.writeFileSync(`${themeDir}/layout/partials/header.html`, origin.header)
      fs.removeSync(`${themeDir}/source/images/newheader.jpg`)
      fs.removeSync(`${themeDir}/i18n/en.yml`)
      fs.removeSync(`${themeDir}/layout/nohtml.yml`)
      fs.removeSync(`${themeDir}/nodir.html`)
    })

    const acyort = new Acyort(config)
    await acyort.start(2222)

    let msgs = []

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:2222')
    page.on('console', ({ text }) => msgs.push(text))

    let color = await page.evaluate(getBodyStyle)
    assert(text('categories/index.html', '.head-tag') === 'Categories')
    assert(text('index.html', '.header p') === config.description)
    assert(color === 'rgb(255, 255, 255)')

    fs.copySync(`${themeDir}/source/images/header.jpg`, `${themeDir}/source/images/newheader.jpg`)
    await sleep(1000)
    assert(fs.existsSync(dir(`${config.public_dir}/images/newheader.jpg`)) === true)
    assert(msgs.length === 2)

    fs.writeFileSync(`${themeDir}/i18n/en.yml`, '# yml')
    await sleep(500)
    assert(msgs.length === 2)

    fs.writeFileSync(`${themeDir}/layout/nohtml.yml`, '# html')
    await sleep(500)
    assert(msgs.length === 2)

    fs.writeFileSync(`${themeDir}/nodir.html`, '# html')
    await sleep(500)
    assert(msgs.length === 2)

    fs.writeFileSync(`${themeDir}/layout/partials/header.html`, headerTpl)
    await sleep(1000)
    assert(text('index.html', '.header p') === config.description + 'more')

    fs.writeFileSync(`${themeDir}/i18n/${config.language}.yml`, i18nTpl)
    await sleep(1000)
    assert(text('categories/index.html', '.head-tag') === 'new Categories')

    fs.writeFileSync(`${themeDir}/source/css/style.css`, styleTpl)
    await sleep(1000)
    color = await page.evaluate(getBodyStyle)
    assert(color === 'rgb(221, 221, 221)')

    fs.writeFileSync(`${themeDir}/layout/layout.html`, layoutTpl)
    await sleep(1000)
    assert(text('categories/index.html', '#special') === 'special')

    fs.writeFileSync(`${themeDir}/layout/categories.html`, categoriesTpl)
    await sleep(1000)
    assert(text('categories/index.html', '.head-tag') === 'new Categoriesmore')

    await browser.close()
    acyort.server.close()
  })

  it('build', async function () {
    this.timeout(10000)

    const acyort = new Acyort(config)
    await acyort.build()

    'css,posts,index.html,page,categories,about'
      .split(',')
      .forEach((tag) => {
        assert(fs.existsSync(dir(tag)) === true)
      })

    assert(text('index.html', 'title') === config.title)
    assert(text('tags/index.html', 'title') === 'Tags | AcyOrt')
    assert(text('posts/71470122.html', '#post h1') === '输入框输入值自动格式化')
    assert(text('posts/223304114.html', '#开发选择') === '开发选择')
    assert(text('about/index.html', '.footer a') === 'Powered by Github | AcyOrt')
  })
})
