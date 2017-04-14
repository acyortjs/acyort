const os = require('os')
const hl = require('highlight.js')
const Marked = require('marked')

function Markdown(content, unhl) {
  const toc = (str) => {
    const title = str
    .toLowerCase()
    .split(' ')
    .join('')
    .split(/\t/)
    .join('')
    .split(/<\/?[^>]+>/)
    .join('')
    .split(/[|$&`~=\\@+*!?({[\]})<>=.,;:'"^]/)
    .join('')
    .split(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/)
    .join('')
    .replace(/-|_/g, '')

    return title
  }
  const escape = (str) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;',
    }
    return str.replace(/[&<>"'`=/]/g, a => map[a])
  }
  const renderer = new Marked.Renderer()

  renderer.code = code => `<pre><code>${code}</code></pre>`
  renderer.heading = (text, level) => `<h${level}>${text}</h${level}>`

  if (!unhl) {
    renderer.code = (code, language) => {
      const valid = language && hl.getLanguage(language)
      const langclass = valid ? ` ${language}` : ''
      const lang = language === 'js' ? 'javascript' : language
      const langmark = valid ? `<div class="mark">${lang}</div>` : ''
      const escapeCode = escape(code)
      const highlighted = valid ? hl.highlightAuto(code).value : escapeCode
      const lineNum = code.split(os.EOL)
      const line = lineNum.map((n, i) => `<span>${i + 1}</span>\n`).join('')

      return `<div class="hljs${langclass}">
      ${langmark}
      <table><tbody><tr>
      ${lineNum.length > 1 ? `<td class="line"><pre>${line}</pre></td>` : ''}
      <td class="code"><pre>${highlighted}</pre></td>
      </tr></tbody></table>
      </div>`
    }

    renderer.heading = (text, level) => `<h${level} id="${toc(text)}">${text}</h${level}>`

    renderer.listitem = (text) => {
      if (/^\s*\[[x ]\]\s*/.test(text)) {
        const tasks = text
        .replace(/^\s*\[ \]\s*/, '<input type="checkbox" disabled> ')
        .replace(/^\s*\[x\]\s*/, '<input type="checkbox" checked disabled> ')

        return `<li style="list-style:none">${tasks}</li>`
      }

      return `<li>${text}</li>`
    }
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
