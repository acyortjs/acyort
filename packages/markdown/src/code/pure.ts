import { escapes } from '../escapes'

export default (block: string) => `<pre class="language-none">
  <code class="language-none">${escapes(block)}</code>
</pre>`
