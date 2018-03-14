module.exports = `
acyort.filter.register('after_init', () => {
  throw new Error('error')
})
`
