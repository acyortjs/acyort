const assert = require('power-assert')
const fs = require('fs-extra')
const pathFn = require('path')
const Config = require('acyort-config')
const Render = require('acyort-render')
const cheerio = require('cheerio')
const Acyort = require('../lib/acyort')

String.prototype.trim = function() {
  return this.replace(/\n/g, '')
}

const base = pathFn.resolve(__dirname, '../assets')
const renderer = new Render()
const config = new Config({ base, renderer }).value

config.cache = true

function dir(path) {
  return pathFn.join(base, path)
}

function text(path, tag) {
  const html = fs.readFileSync(dir(path))
  const $ = cheerio.load(html)
  return $(tag).text().trim()
}

describe('acyort', () => {
  it('build', async function () {
    this.timeout(10000)

    const acyort = new Acyort(config)
    await acyort.build()

    'css,post,index.html,page,category,about'
      .split(',')
      .forEach((tag) => {
        assert(fs.existsSync(dir(tag)) === true)
      })

    assert(text('index.html', 'title') === config.title)
    assert(text('tag/index.html', 'title') === 'Tags | AcyOrt')
    assert(text('post/71470122.html', '#post h1') === '输入框输入值自动格式化')
    assert(text('post/223304114.html', '#开发选择') === '开发选择')
    assert(text('about/index.html', '.footer a') === 'Powered by Github | AcyOrtSource')
  })
})
