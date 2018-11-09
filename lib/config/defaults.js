const moment = require('moment-timezone')

const defaults = {
  url: 'https://acyort.com',
  scripts: [],
  plugins: [],
  public: '/',
  timezone: moment.tz.guess(),
  language: 'en',
  root: '/',
  template: 'ccc45',
}

module.exports = defaults
