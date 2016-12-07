const hl = require('highlight.js')
const Marked = require('marked')
const { convert } = require('../util')

function Markedown(content, uncode) {
    const renderer = new Marked.Renderer()

    if (uncode) {
        renderer.code = code => `<pre><code>${code}</code></pre>`
    }

    renderer.heading = (text, level) => `<h${level} id="${convert(text)}">${text}</h${level}>`

    Marked.setOptions({
        renderer,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight(code) {
            return hl.highlightAuto(code).value
        },
    })

    return Marked(content)
}

module.exports = Markedown
