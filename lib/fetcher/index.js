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

    this.logger = new Logger()
    this.config = config
    this.jsonPath = path.join(process.cwd(), 'ISSUE_DATA.json')
    this.page = 1
    this.issues = []
  }

  _getJson() {
    try {
      return fs.readJsonSync(this.jsonPath, { throws: false })
    } catch (e) {
      return false
    }
  }

  _outputJson() {
    if (this.config.dev) {
      fs.outputFileSync(this.jsonPath, JSON.stringify(this.issues))
    }
  }

  _load(resolve, reject) {
    return this._get(this.page)
    .then(({ data, headers }) => {
      this.issues = this.issues.concat(data)

      if (!ifNext(headers)) {
        this._outputJson()
        resolve(this.issues)
      } else {
        this.page += 1
        setTimeout(() => { this._load(resolve, reject) }, 1000)
      }
    })
    .catch(err => reject(err))
  }

  fetch() {
    const json = this._getJson()

    if (this.config.dev && json) {
      this.logger.info('Data from cache...')
      return Promise.resolve(json)
    }

    return new Promise((resolve, reject) => {
      return this._load(resolve, reject)
    })
  }
}

module.exports = Fetcher
