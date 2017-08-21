const os = require('os')
const hl = require('highlight.js')
const escape = require('./escape')
const config = require('../../config')

function hlcode(code, language) {
  const valid = language && hl.getLanguage(language)
  const lang = language === 'js' ? 'javascript' : language
  const langClass = valid ? ` ${lang}` : ''
  const hled = valid ? hl.highlightAuto(code).value : escape(code)
  const lineNum = code.split(os.EOL)

  if (!config.line_numbers) {
    return `
      <div class="hljs${langClass}">
        <pre>${hled}</pre>
      </div>
    `
  }

  return `
    <div class="hljs${langClass}">
      <table>
        <tbody>
          <tr>
            <td class="line">
              <pre>${lineNum.map((n, i) => `<span>${i + 1}</span>\n`).join('')}</pre>
            </td>
            <td class="code"><pre>${hled}</pre></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

module.exports = hlcode
