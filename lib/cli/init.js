const ignore = require('./ignore')

module.exports = {
  name: 'init',
  fullName: 'init [folder]',
  description: 'Create new website',
  action() {
    console.log(ignore)
  },
}
