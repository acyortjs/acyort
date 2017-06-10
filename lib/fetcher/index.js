const Request = require('./request')
const pathFn = require('path')
const fs = require('fs-extra')

class Fetcher extends Request {
  constructor(acyort) {
    const {
      dev,
      logger,
      config: {
        user,
        repository,
        token,
      }
    } = acyort

    super(acyort.config)

    this.jsonPath = pathFn.join(process.cwd(), 'ISSUE_DATA.json')
    this.dev = dev
    this.logger = logger
    this.token = token
    this.user = user
    this.repository = repository
    this.per_page = 20
    this.page = 1
    this.msg = `Getting data from GitHub (${user}/${repository})`
    this.issues = []
  }

  getJson() {
    try {
      const json = require(this.jsonPath)
      this.logger.info('Data from cache...')
      return json
    } catch (e) {
      return false
    }
  }

  options() {
    let args = {
      page: this.page,
      per_page: this.per_page,
    }

    if (this.token) {
      args = Object.assign({
        access_token: this.token.split('#').join('')
      }, args)
    }

    return args
  }

  outputJson() {
    this.dev && fs.outputFileSync(this.jsonPath, JSON.stringify(this.issues))
  }

  load(resolve, reject) {
    this.logger.info(this.msg, ` ... ${this.page}`)

    return this.getData(this.options())
    .then((res) => {
      const { data } = res
      this.issues = this.issues.concat(data)

      if (!this.ifNext(res)) {
        this.outputJson()
        return resolve(this.issues)
      }

      this.page += 1
      setTimeout(() => { this.load(resolve, reject) }, 1000)
    })
    .catch(err => reject(err))
  }

  fetch() {
    const json = this.getJson()

    if (this.dev && json) {
      return Promise.resolve(json)
    }

    return new Promise((resolve, reject) => {
      if (!this.user || !this.repository) {
        return reject('Missing repository infomation')
      }
      return this.load(resolve, reject)
    })
  }

  ifNext(data) {
    const { headers: { link } } = data
    return link && link.indexOf('rel="next"') > -1
  }
}

module.exports = Fetcher
