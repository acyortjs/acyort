const signale = require('signale')

function instance(option) {
  return new signale.Signale(option)
}

Object.keys(signale)
  .filter(key => key.charAt(0) !== '_' && key !== 'Signale')
  .forEach((name) => {
    instance[name] = signale[name]
  })

module.exports = instance
