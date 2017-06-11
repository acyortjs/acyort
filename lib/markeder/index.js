const marked = require('marked')
const { Renderer } = marked
const renderFn = require('./renderer')

function markeder(content, forRss) {
  marked.setOptions({
    renderer: Object.assign(new Renderer(), renderFn(forRss)),
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
