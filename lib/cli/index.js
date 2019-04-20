const signale = require('signale')

class Cli {
  constructor() {
    this.commands = []
    this.options = []
  }

  register(type, cli) {
    if (!this[type]) {
      signale.error(`Not supports cli type: ${type}`)
      return
    }

    const { name, alias } = cli

    if (type === 'options') {
      if (name.charAt(0) !== '-'
        || name.charAt(1) !== '-'
        || alias.charAt(0) !== '-'
      ) {
        signale.warn('Option name error')
        return
      }
    }

    this[type].push(cli)
  }

  getAction(type, argv) {
    if (!argv) {
      return undefined
    }

    const { action } = this[type]
      .find(({ name, alias }) => name === argv || alias === argv) || {}

    return action
  }
}

module.exports = new Cli()
