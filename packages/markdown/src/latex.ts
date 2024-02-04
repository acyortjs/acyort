import katex from 'katex'
import { unescapes } from './escapes'

const regex = /(\${1,2})((?:\\.|[\s\S])*?)\1/

export default (text: string) => {
  const block = regex.exec(text)
  if (block) {
    if (block[0] === '$$') {
      return `<p>${text}</p>`
    }

    const unescaped = unescapes(block[2])
    const math = katex.renderToString(unescaped)

    if (block[1] === '$' || block[0] === block.input) {
      return `<p class="latex-math">${text.replace(block[0], math)}</p>`
    }

    return `<p>
    ${text.replace(block[0], `</p>
  <div class="latex-math" style="text-align:center">
    ${math}
  </div>
<p>`)}
  </p>`
  }
  return `<p>${text}</p>`
}
