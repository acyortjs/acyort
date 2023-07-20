import { EOL } from 'os'
import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index'
import pureCode from './pure'

export default class {
  private lineNumbers?: boolean

  constructor(lineNumbers?: boolean) {
    this.lineNumbers = lineNumbers
  }

  codeRender(block: string, lang?: string, lineNumbers?: boolean) {
    let codeString: string | undefined

    if (!lang) {
      codeString = pureCode(block)
    } else {
      loadLanguages(lang)
      const grammar = prism.languages[lang]

      codeString = grammar
        ? `<pre class="language-${lang}">
  <code class="language-${lang}">${prism.highlight(block, grammar, lang)}</code>
</pre>`
        : pureCode(block)
    }

    const line = `<pre class="language-none">
  <code class="language-none">
    ${block.split(EOL).map((n, i) => `<span>${i + 1}</span>\n`).join('')}
  </code>
</pre>`

    const codeWidthLines = `<div class="code-highlight">
  <table>
    <tbody>
      <tr>
        <td class="code-highlight-line">${line}</td>
        <td class="code-highlight-code">${codeString}</td>
      </tr>
    </tbody>
  </table>
</div>`

    if (lineNumbers === false) {
      return codeString
    }
    if (lineNumbers) {
      return codeWidthLines
    }
    return this.lineNumbers ? codeWidthLines : codeString
  }
}
