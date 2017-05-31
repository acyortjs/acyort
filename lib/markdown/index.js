const marded = require('marked')
const { Renderer } = marked
const renderFn = require('./renderer')

function markdown(content, forRss) {
  const renderer = Object.assign(new Renderer(), renderFn(forRss))

  marked.setOptions({
    renderer,
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

module.exports = markdown
