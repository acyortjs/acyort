const moment = require('moment-timezone')

const defaults = {
  title: '',
  description: '',
  rss: 'rss.xml',
  url: '',
  theme: 'ccc45',
  per_page: 10,
  menu: null,
  default_category: 'uncategorized',
  user: '',
  repository: '',
  scripts: [],
  public_dir: '/',
  authors: [],
  timezone: moment.tz.guess(),
  language: 'default',
  line_numbers: true,
  archives_per_page: 30,
  order: 'created',
  thumbnail_mode: 2,
  category_dir: 'category',
  tag_dir: 'tag',
  post_dir: 'posts',
  archives_dir: 'archives',
  token: '',
  json: false,
  dev: false,
  root: '/',
  scripts_dir: 'scripts',
}

module.exports = defaults
