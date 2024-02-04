import paginator from '../src'

it('no pages', () => {
  const res = paginator({
    baseUrl: '/xxx/yyy',
    perpage: 0,
    data: [1, 2, 3],
  })
  expect(res).toMatchSnapshot()
})

it('pages', () => {
  const res = paginator({
    baseUrl: '/',
    perpage: 2,
    data: [1, 2, 3, 4, 5],
  })
  expect(res).toMatchSnapshot()
})

it('prefix', () => {
  const res = paginator({
    baseUrl: '/',
    perpage: 3,
    data: [1, 2, 3, 4, 5],
    prefix: 'nav',
  })
  expect(res).toMatchSnapshot()
})
