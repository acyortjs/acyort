import Markdown, { RenderOptions } from '../src'

it('heading', () => {
  const m1 = new Markdown()
  const h0 = '# An h1 header'
  const h1 = '# [An h1 header](#one)'

  expect(m1.render(h0)).toMatchSnapshot()
  expect(m1.render(h1)).toMatchSnapshot()

  const options: RenderOptions = {
    getHeadingId: (t) => `${t.trim().split(' ').join('')}`,
  }
  expect(m1.render(h0, options)).toMatchSnapshot()

  const m2 = new Markdown(options)
  expect(m2.render(h0)).toMatchSnapshot()
})
