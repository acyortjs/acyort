const moment = require('moment-timezone')

const defaults = {
  url: 'https://acyort.com',
  scripts: [],
  plugins: [],
  public_dir: '/',
  timezone: moment.tz.guess(),
  language: 'en',
  root: '/',
  template: 'ccc45',
  scripts_dir: 'scripts',
  i18n_dir: 'i18n',
  source_dir: 'source',
  layout_dir: 'layout',
}

module.exports = defaults
