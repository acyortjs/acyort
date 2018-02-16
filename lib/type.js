const pathFn = require('path')

function getType(tags, file) {
  const {
    theme,
    language,
    source_dir: sourceDir,
    layout_dir: layoutDir,
    i18n_dir: i18nDir,
  } = this
  const ext = pathFn.extname(file)
  const dir = {
    source: `${theme}/${sourceDir}/`,
    layout: `${theme}/${layoutDir}/`,
    i18n: `${theme}/${i18nDir}/`,
  }

  if (file.indexOf(dir.source) > -1) {
    if (ext === '.css') {
      return 'css'
    }
    return 'static'
  }

  if (file.indexOf(dir.i18n) > -1) {
    if (file.indexOf(`${language}.yml`) > -1) {
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
