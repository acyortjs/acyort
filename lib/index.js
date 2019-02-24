const acyort = require('./acyort')
const plugin = require('./plugin')

module.exports = (config) => {
  const ctx = acyort(config)
  plugin(ctx)
  return ctx
}
