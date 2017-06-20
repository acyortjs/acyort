const axios = require('axios')

axios.defaults.headers['User-Agent'] = 'AcyOrt'

function getArgs(args) {
  return Object
  .keys(args)
  .map(arg => `${arg}=${args[arg]}`)
  .join('&')
}

class Request {
  constructor(config) {
    const { user, repository } = config

    this.host = 'https://api.github.com'
    this.path = `/repos/${user}/${repository}/issues`
  }

  getData(args) {
    return axios.get(`${this.host + this.path}?${getArgs(args)}`)
  }
}

module.exports = Request
