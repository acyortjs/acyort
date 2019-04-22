const copy = require('./copy')
const output = require('./output')

module.exports = acyort => ({
  copySource: copy.bind(acyort),
  outputHTML: output.bind(acyort),
})
