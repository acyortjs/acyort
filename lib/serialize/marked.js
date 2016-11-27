
const hl = require('highlight.js')
const marked = require('marked')

module.exports = function(content, uncode) {

    const renderer = new marked.Renderer()

    if (uncode) {
        renderer.code = (code, lang, escaped) => `<pre><code>${code}</code></pre>`
    }

    marked.setOptions({
        renderer: renderer,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight: (code) => hl.highlightAuto(code).value
    })

    return marked(content)

}
