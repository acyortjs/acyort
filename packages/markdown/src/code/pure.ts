import { escapes } from '../escapes'

export default (block: string) => `<pre class="language-none">${escapes(block).trim()}</pre>`
