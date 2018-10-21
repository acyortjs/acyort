const keep = require('../keep')

module.exports = {
  name: 'clean',
  fullName: 'clean',
  description: 'Remove generated files',
  action() {
    console.log(keep)
  },
}
