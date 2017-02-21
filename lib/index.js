const fs = require('fs-extra')
const pathFn = require('path')
const config = require('./config')()
const serialize = require('./serialize')
const build = require('./build')
const feed = require('./feed')
const source = require('./source')
const jsonFn = require('./json')
const { log } = require('./util')
const fetch = require('./fetch')

function Acyort() {
  const jsonPath = pathFn.join(process.cwd(), 'ISSUE_DATA.json')

  if (process.env.NODE_ENV === 'dev') {
    config.dev = true
  }

  global.config = config

  const tobuild = (data) => {
    global.data = data

    if (config.json) {
      jsonFn(data)
      return Promise.resolve()
    }

    if (!global.live) {
      source()
      feed(data.posts)
    }

    build(data)
    return Promise.resolve()
  }

  if (config.dev) {
    if (global.live && global.data) {
      build(global.data)
      return Promise.resolve()
    }

    if (fs.existsSync(jsonPath)) {
      log.info('Data from cache...')

      /* eslint-disable */
      const json = require(jsonPath)
      /* eslint-disable */

      return serialize(json)
      .then(data => tobuild(data))
      .catch(e => log.error(e))
    }
  }

  return fetch()
  .then((res) => {
    fs.outputFileSync(jsonPath, JSON.stringify(res))
    return serialize(res)
  })
  .then(data => tobuild(data))
  .catch(e => log.error(e))
}

module.exports = Acyort
