module.exports = `
acyort.extend.register('after_init', () => {
  throw new Error('error')
})
`
