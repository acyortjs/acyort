const axios = require('axios')

axios.defaults.headers['User-Agent'] = 'AcyOrt'

class Request {
  constructor(user, repo, args = {}) {
    this.host = 'https://api.github.com'
    this.user = user
    this.repo = repo
    this.args = args
  }

  get thePath() {
    return `/repos/${this.user}/${this.repo}/issues`
  }

  get theArgs() {
    return Object
    .keys(this.args)
    .map(arg => `${arg}=${this.args[arg]}`)
    .join('&')
  }

  fetch() {
    const url = `${this.host + this.thePath}?${this.theArgs}`
    return axios.get(url).then(res => res)
  }
}

module.exports = Request
