const moment = require('moment-timezone')

const defaults = {
  title: 'AcyOrt',
  description: 'A Node.js blog tool powered by GitHub.',
  timezone: moment.tz.guess(),
  rss: 'rss.xml',
  url: 'https://acyortjs.github.io',
  language: 'default',
  theme: 'ccc45',
  per_page: 10,
  archives_per_page: 30,
  thumbnail_mode: 2,
  menu: {
    archives: '/archives',
    category: '/category',
    tag: '/tag',
  },
  order: 'created',
  line_numbers: true,
  public_dir: '/',
  category_dir: 'category',
  tag_dir: 'tag',
  post_dir: 'posts',
  archives_dir: 'archives',
  default_category: 'uncategorized',
  user: 'acyortjs',
  repository: 'acyortjs.github.io',
  authors: [],
  token: '',
  json: false,
  dev: false,
  scripts_dir: 'scripts',
}

module.exports = defaults
