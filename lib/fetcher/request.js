const axios = require('axios')
const Logger = require('../logger')
const config = require('../config')

class Request {
  constructor() {
    const { user, repository, token } = config

    this.logger = new Logger()
    this.host = 'https://api.github.com'
    this.path = `/repos/${user}/${repository}/issues`
    this.msg = `Getting data from GitHub (${user}/${repository})`
    this.token = token ? token.split('#').join('') : ''
    this.per_page = 20
  }

  _config(page) {
    const headers = { 'User-Agent': 'AcyOrt' }

    if (this.token) {
      headers.Authorization = `token ${this.token}`
    }

    return {
      url: this.path,
      method: 'get',
      baseURL: this.host,
      headers,
      params: {
        per_page: this.per_page,
        page
      }
    }
  }

  _get(page) {
    this.logger.info(this.msg, ` ... ${page}`)
    return axios(this._config(page))
  }
}

module.exports = Request
