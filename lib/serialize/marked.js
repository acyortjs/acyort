const os = require('os')
const hl = require('highlight.js')
const Marked = require('marked')
const { convert } = require('../util')

function Markedown(content, unhl) {
    const renderer = new Marked.Renderer()

    if (unhl) {
        renderer.code = code => `<pre><code>${code}</code></pre>`
    } else {
        renderer.code = (code, language) => {
            const valid = language && hl.getLanguage(language)
            const langclass = valid ? ` ${language}` : ''
            const langmark = valid ? `<span class="mark">${language}</span>` : ''
            const highlighted = valid ? hl.highlightAuto(code).value : code

            const line = code
                .split(os.EOL).map((n, i) => `<span>${i + 1}</span><br />`)
                .join('')

            return `<div class="hljs${langclass}">
                    ${langmark}
                    <table><tbody><tr>
                    <td class="line"><pre><code>${line}</code></pre></td>
                    <td class="code"><pre><code>${highlighted}</code></pre></td>
                    </tr></tbody></table>
                    </div>`
        }
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
    })

    return Marked(content)
}

module.exports = Markedown
