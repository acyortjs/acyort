import Markdown from '../src'

it('code', () => {
  const m0 = new Markdown()

  const c0 = `\`\`\`html
  <h1>h1</h1>
\`\`\``
  expect(m0.render(c0)).toMatchSnapshot()
  expect(m0.render(c0, { lineNumbers: false })).toMatchSnapshot()
  expect(m0.render(c0, { lineNumbers: true })).toMatchSnapshot()

  const c1 = `\`\`\`javascript
  var a = 1;
\`\`\``
  expect(m0.render(c1)).toMatchSnapshot()

  const c2 = `\`\`\`
  <h1>h1</h1>
\`\`\``
  expect(m0.render(c2)).toMatchSnapshot()
  expect(m0.render(c2, { lineNumbers: true })).toMatchSnapshot()

  const c3 = `\`\`\`sss
  <h1>h1</h1>
\`\`\``
  expect(m0.render(c3)).toMatchSnapshot()

  const m1 = new Markdown({ lineNumbers: true })
  expect(m1.render(c0)).toMatchSnapshot()

  const m2 = new Markdown({ lineNumbers: false })
  expect(m2.render(c0)).toMatchSnapshot()
})

it('code language case insensitive', () => {
  const m = new Markdown()

  const upper = `\`\`\`TS
const a: number = 1;
\`\`\``
  const lower = `\`\`\`ts
const a: number = 1;
\`\`\``

  const out0 = m.render(upper)
  const out1 = m.render(lower)

  expect(out0).toContain('language-TS')
  expect(out0).toContain('token')
  expect(out1).toContain('language-ts')
  expect(out1).toContain('token')
  // same highlighting for upper and lower case lang
  expect(out0.replace('language-TS', 'language-ts')).toBe(out1)

  const htmlUpper = `\`\`\`HTML
<h1>h1</h1>
\`\`\``
  expect(m.render(htmlUpper)).toContain('token')
})

it('code additional languages', () => {
  const m = new Markdown()

  const cases: [string, string][] = [
    ['md', '# heading\n\n**bold**'],
    ['diff', '- removed\n+ added'],
    ['bash', 'echo hello'],
    ['json', '{"a": 1}'],
    ['yml', 'a: 1'],
    ['jsx', '<div />'],
    ['tsx', 'const a = <div />'],
    ['python', 'def f():\n  pass'],
    ['py', 'def f():\n  pass'],
    ['go', 'func main() {}'],
    ['rust', 'fn main() {}'],
    ['sql', 'SELECT * FROM t'],
    ['c++', 'int main() { return 0; }'],
  ]

  cases.forEach(([lang, code]) => {
    const content = `\`\`\`${lang}\n${code}\n\`\`\``
    const out = m.render(content)
    expect(out).toContain(`language-${lang}`)
    expect(out).toContain('token')
  })

  expect(m.render('```shell\necho hi\n```')).toContain('token')
})

it('code prototype chain key fallback', () => {
  const m = new Markdown()

  const content = `\`\`\`constructor
test
\`\`\``
  // falls back to plain escape, no crash, no weird tokens
  const out = m.render(content)
  expect(out).not.toContain('token')
  expect(out).toContain('language-none')
})

it('code line numbers with crlf', () => {
  const m = new Markdown()

  const content = '```js\r\nconst a = 1;\r\nconst b = 2;\r\n```'
  const out = m.render(content, { lineNumbers: true })
  const spans = out.match(/<span>\d+<\/span>/g)

  // marked normalizes CRLF to LF, block passed to renderer has 2 lines
  expect(spans).toEqual([
    '<span>1</span>',
    '<span>2</span>',
  ])
})
