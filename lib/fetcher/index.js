const Request = require('./request')

class Fetcher extends Request {
  constructor(ctx) {
    super(ctx)
    const {
      log,
      config: {
        user,
        repository,
        token,
      }
    } = ctx

    this.log = log
    this.token = token
    this.per_page = 20
    this.page = 1
    this.msg = `Getting data from GitHub (${user}/${repository})`
    this.issues = []
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

  load(resolve, reject) {
    this.log.info(this.msg, ` ... ${this.page}`)

    this.getData(this.options())
    .then((res) => {
      const { data } = res
      this.issues = this.issues.concat(data)

      if (!this.ifNext(res)) {
        return resolve(this.issues)
      }

      this.page += 1
      setTimeout(() => { this.load() }, 1000)
    })
    .catch(err => reject(err))
  }

  fetch() {
    return new Promise((resolve, reject) => {
      if (!this.user || !this.repository) {
        return reject('Missing repository infomation')
      }
      return this.load(resolve, reject)
    })
  }

  ifNext(data) {
    const {
      headers: { link }
    } = data

    return link && link.indexOf('rel="next"') > -1
  }
}
