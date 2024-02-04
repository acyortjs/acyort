import { EOL } from 'os'
import prism from 'prismjs'
import pureCode from './pure'

export default class {
  private lineNumbers?: boolean

  constructor(lineNumbers?: boolean) {
    this.lineNumbers = lineNumbers
  }

  protected codeRender(block: string, lang?: string, lineNumbers?: boolean) {
    let codeString: string | undefined

    if (!lang) {
      codeString = pureCode(block)
    } else {
      const grammar = prism.languages[lang]

      codeString = grammar
        ? `<pre class="language-${lang}">${prism.highlight(block, grammar, lang).trim()}</pre>`
        : pureCode(block)
    }

    const line = `<pre class="language-none">${block.split(EOL).map((n, i) => `<span>${i + 1}</span>`).join('\n')}</pre>`

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
