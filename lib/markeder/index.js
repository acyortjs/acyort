const marked = require('marked')
const { Renderer } = marked
const parser = require('./parser')

function markeder(content, unParse) {
  marked.setOptions({
    renderer: Object.assign(new Renderer(), parser(unParse)),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
  })

  return marked(content)
}

module.exports = markeder
