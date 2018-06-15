module.exports = `
acyort.template.action('head', function () {
  return this.length || 0
})
acyort.template.action('footer', function () {
  return 'footer'
})
acyort.template.action('_footer', function () {
  return false
})
`
