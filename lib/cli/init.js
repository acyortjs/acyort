const ignores = require('./ignore')
const getConfig = require('./config')

module.exports = {
  name: 'init',
  fullName: 'init [folder]',
  description: 'Create new website',
  action() {
    console.log(getConfig())
  },
}
