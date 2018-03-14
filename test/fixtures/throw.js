module.exports = `
acyort.filter.register('after_init', () => {
  throw new Error('error')
})

acyort.filter.register('after_init', 'no a function')
`
