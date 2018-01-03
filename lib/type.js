const pathFn = require('path')
const allTags = require('./tags')

function getType(config, file) {
  const { theme } = config
  const tags = allTags.slice(0)
  const ext = pathFn.extname(file)
  const dir = {
    source: `${theme}/${config.source_dir}/`,
    layout: `${theme}/${config.layout_dir}/`,
    i18n: `${theme}/${config.i18n_dir}/`,
  }

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

  if (ext !== '.html') {
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
