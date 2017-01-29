const os = require('os')
const hl = require('highlight.js')
const Marked = require('marked')

function Markdown(content, unhl) {
    const toc = (str) => {
        const title = str
            .toLowerCase()
            .split(' ')
            .join('-')
            .split(/\t/)
            .join('--')
            .split(/<\/?[^>]+>/)
            .join('')
            .split(/[|$&`~=\\@+*!?({[\]})<>=.,;:'"^]/)
            .join('')
            .split(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/)
            .join('')

        return title
    }
    const renderer = new Marked.Renderer()

    renderer.code = code => `<pre><code>${code}</code></pre>`
    renderer.heading = (text, level) => `<h${level}>${text}</h${level}>`

    if (!unhl) {
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

        renderer.heading = (text, level) => `<h${level} id="${toc(text)}">${text}</h${level}>`
    }

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

module.exports = Markdown
