const logger = require('../../logger')

module.exports = {
  name: 'flow',
  fullName: 'flow',
  description: 'Start AcyOrt workflow',
  action() {
    this.workflow
      .start()
      .catch(logger.error)
  },
}
