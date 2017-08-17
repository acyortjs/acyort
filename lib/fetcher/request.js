const axios = require('axios')
const Logger = require('../logger')
const config = require('../config')

class Request {
  constructor() {
    const { user, repository, token, dev } = config

    this._logger = new Logger()
    this._host = 'https://api.github.com'
    this._path = `/repos/${user}/${repository}/issues`
    this._msg = `Getting data from GitHub (${user}/${repository})`
    this._token = token ? token.split('#').join('') : ''
    this._per_page = dev ? 3 : 20
  }

  _getConfig(page) {
    const headers = { 'User-Agent': 'AcyOrt' }

    if (this._token) {
      headers.Authorization = `token ${this._token}`
    }

    return {
      url: this._path,
      method: 'get',
      baseURL: this._host,
      headers,
      params: {
        per_page: this._per_page,
        page
      }
    }
  }

  get(page) {
    this._logger.info(this._msg, ` ... ${page}`)
    return axios(this._getConfig(page))
  }
}

module.exports = Request
