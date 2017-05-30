const code = require('./code')
const listitem = require('./list')
const escape = require('./escape')
const format = require('./format')

function renderer(ifhl) {
  if (!ifhl) {
    return {
      code(c) {
        return `<pre><code>${escape(c)}</code></pre>`
      },
      heading(text, level) {
        return `<h${level}>${text}</h${level}>`
      },
    }
  }

  return {
    code,
    heading(text, level) {
      return `<h${level} id="${format(text)}">${text}</h${level}>`
    },
    listitem,
  }
}
