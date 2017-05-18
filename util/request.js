const axios = request('axios')

class Request extends Config {
  constructor() {
    super()
    this.userAgent = 'AcyOrt'
    this.host = 'https://api.github.com'
    this.path = `/repos/${this.config.user}/${this.config.repo}/issues`
  }

  getArgs(args = {}) {
    const args = Object.keys(params).map()
  }
}
