const axios = require('axios')

axios.defaults.headers['User-Agent'] = 'AcyOrt'

class Request {
  constructor(ctx) {
    const {
      config: {
        user,
        repository,
      }
    } = ctx

    this.host = 'https://api.github.com'
    this.user = user
    this.repository = repository
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
