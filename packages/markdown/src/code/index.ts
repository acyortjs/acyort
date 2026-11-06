import prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-less'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-objectivec'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-tsx'
import pureCode from './pure'

// markdown code fence aliases not identical to prism language keys
const langAliases = {
  yml: 'yaml',
  sh: 'bash',
  shell: 'bash',
  'c++': 'cpp',
  'c#': 'csharp',
  kt: 'kotlin',
  py: 'python',
  rs: 'rust',
  rb: 'ruby',
} as Record<string, string>

// avoid prototype chain keys like `constructor` / `__proto__`
const getGrammar = (lang: string) => {
  const name = langAliases[lang.toLowerCase()] || lang.toLowerCase()
  return Object.prototype.hasOwnProperty.call(prism.languages, name)
    ? prism.languages[name]
    : undefined
}

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
      const grammar = getGrammar(lang)

      codeString = grammar
        ? `<pre class="language-${lang}">${prism.highlight(block, grammar, lang).trim()}</pre>`
        : pureCode(block)
    }

    const line = `<pre class="language-none">${block.replace(/\r\n/g, '\n').split('\n').map((n, i) => `<span>${i + 1}</span>`).join('\n')}</pre>`

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
