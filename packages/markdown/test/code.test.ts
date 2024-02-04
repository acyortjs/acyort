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
