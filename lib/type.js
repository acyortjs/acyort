const pathFn = require('path')
const allTags = require('./tags')

function getType(config, file) {
  const dir = {
    source: `${config.theme}/source/`,
    layout: `${config.theme}/layout/`,
    i18n: `${config.theme}/i18n/`,
  }
  const tags = allTags.slice(0)
  const ext = pathFn.extname(file)

  if (file.indexOf(dir.source) > -1) {
    if (ext === '.css') {
      return 'css'
    }
    return 'static'
  }

  if (file.indexOf(dir.i18n) > -1) {
    if (file.indexOf(`${config.language}.yml`) > -1) {
      return 'i18n'
    }
    return ''
  }

  if (file.indexOf(dir.layout) === -1 || ext !== '.html') {
    return ''
  }

  const path = file.split(dir.layout)[1]

  if (path.indexOf('/') > -1) {
    return 'html'
  }

  const tag = path.split('.html')[0]

  if (tags.indexOf(tag) > -1) {
    return tag
  }

  return 'html'
}

module.exports = getType
