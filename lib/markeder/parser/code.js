const os = require('os')
const hl = require('highlight.js')
const escape = require('./escape')

function hlcode(code, language) {
  const valid = language && hl.getLanguage(language)
  const lang = language === 'js' ? 'javascript' : language
  const langClass = valid ? ` ${lang}` : ''
  const langMark = valid ? `<div class="mark">${lang}</div>` : ''
  const hled = valid ? hl.highlightAuto(code).value : escape(code)
  const lineNum = code.split(os.EOL)

  let lineTag = ''

  if (lineNum.length > 1) {
    lineTag = `
      <td class="line">
        <pre>${lineNum.map((n, i) => `<span>${i + 1}</span>\n`).join('')}</pre>
      </td>
    `
  }

  return `
    <div class="hljs${langClass}">
      ${langMark}
      <table>
        <tbody>
          <tr>
            ${lineTag}
            <td class="code"><pre>${hled}</pre></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

module.exports = hlcode
