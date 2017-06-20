const chalk = require('chalk')

const logFn = global.console

class Log {
  constructor() {
    this.log = logFn.log
  }

  error(message) {
    this.log(chalk.red('\u2716'), message)
  }

  success(message) {
    this.log(chalk.green('\u2714'), message)
  }

  info(message, addition = '') {
    this.log(chalk.blue(message), addition)
  }
}

module.exports = Log
