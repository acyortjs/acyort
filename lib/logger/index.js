const chalk = require('chalk')

const { log } = global.console

class Log {
  constructor() {
    this._log = log
  }

  error(message) {
    this._log(chalk.red('\u2716'), message)
  }

  success(message) {
    this._log(chalk.green('\u2714'), message)
  }

  info(message, addition = '') {
    this._log(chalk.blue(message), addition)
  }
}

module.exports = Log
