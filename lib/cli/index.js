class Cli {
  constructor() {
    this.commands = []
    this.options = []
  }

  register(type, cli) {
    if (!this[type]) {
      throw new Error(`Not supports cli type: ${type}`)
    }

    const { name, alias } = cli

    if (type === 'options') {
      if (name.charAt(0) !== '-'
        || name.charAt(1) !== '-'
        || alias.charAt(0) !== '-'
      ) {
        throw new Error(`Option register error, name: ${name}, alias: ${alias}`)
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
