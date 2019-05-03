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

    const exist = this[type].find((item) => {
      if (item.name === name) {
        return true
      }
      if (item.alias && item.alias === alias) {
        return true
      }
      return false
    })

    if (exist) {
      throw new Error(`Register error, ${type}: ${name}${alias ? ` | ${alias}` : ''} currently exists`)
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
