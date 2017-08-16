const path = require('path')
const fs = require('fs-extra')
const Request = require('./request')
const Logger = require('../logger')
const config = require('../config')

function ifNext(headers) {
  const { link } = headers
  return link && link.indexOf('rel="next"') > -1
}

class Fetcher extends Request {
  constructor() {
    super()

    this._logger = new Logger()
    this._config = config
    this._jsonPath = path.join(process.cwd(), 'ISSUE_DATA.json')
    this._page = 1
    this._issues = []
  }

  _getJson() {
    try {
      return fs.readJsonSync(this._jsonPath, { throws: false })
    } catch (e) {
      return false
    }
  }

  _outputJson() {
    if (this._config.dev) {
      fs.outputFileSync(this._jsonPath, JSON.stringify(this._issues))
    }
  }

  _load(resolve, reject) {
    return this.get(this._page)
    .then(({ data, headers }) => {
      this._issues = this._issues.concat(data)

      if (!ifNext(headers)) {
        this._outputJson()
        resolve(this._issues)
      } else {
        this._page += 1
        setTimeout(() => { this._load(resolve, reject) }, 1000)
      }
    })
    .catch(err => reject(err))
  }

  fetch() {
    const json = this._getJson()

    if (this._config.dev && json) {
      this._logger.info('Data from cache...')
      return Promise.resolve(json)
    }

    return new Promise((resolve, reject) => {
      return this._load(resolve, reject)
    })
  }
}

module.exports = Fetcher
