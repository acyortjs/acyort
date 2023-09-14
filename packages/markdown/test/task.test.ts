import Markdown from '../src'

it('task', () => {
  const m = new Markdown()
  const t0 = '- [x] this is a complete item'
  const t1 = '* Item 1'

  expect(m.render(t0)).toMatchSnapshot()
  expect(m.render(t1)).toMatchSnapshot()
})
