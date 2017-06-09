const axios = require('axios')

axios.defaults.headers['User-Agent'] = 'AcyOrt'

class Request {
  constructor(config) {
    const { user, repository } = config

    this.host = 'https://api.github.com'
    this.path = `/repos/${user}/${repository}/issues`
  }

  getArgs(args) {
    return Object
    .keys(args)
    .map(arg => `${arg}=${args[arg]}`)
    .join('&')
  }

  getData(args) {
    return axios.get(`${this.host + this.path}?${this.getArgs(args)}`)
  }
}

module.exports = Request
