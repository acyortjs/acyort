const version = require('./version')
const clean = require('./clean')
const init = require('./init')
const generate = require('./generate')

class C {
  constructor() {
    this.commands = []
    this.options = []
  }

  register(type, cli) {
    if (!this[type]) {
      throw new Error(`not supports type: ${type}`)
    }

    const { name, alias } = cli

    if (
      type === 'option'
      && name.chartAt(0) !== '-'
      && name.chartAt(1) !== '-'
      && alias.chartAt(0) !== '-'
    ) {
      throw new Error('option name error')
    }
    this[type].push(cli)
  }

  getAction(type, argv) {
    if (!argv) {
      return undefined
    }

    const { action } = this[type].find(({ name, alias }) => name === argv || alias === argv) || {}

    return action
  }

  get help() {
    const { commands, options } = this
    const width = 24

    let help = `AcyOrt, A Node.js static website framework

Commands:`

    commands.forEach(({ fullName, description }) => {
      help += `
  ${fullName}${new Array(width - fullName.length).fill(' ').join('')}${description}`
    })

    help += `

Options:`

    options.forEach(({ name, alias, description }) => {
      help += `
  ${name}, ${alias}${new Array(width - 2 - name.length - alias.length).fill(' ').join('')}${description}`
    })

    help += `

For more, check the docs: https://acyort.com
`

    return help
  }
}

const c = new C()

c.register('commands', init)
c.register('commands', generate)
c.register('commands', clean)
c.register('options', version)
c.register('options', {
  name: '--help',
  alias: '-h',
  description: 'Show help',
  action() {
    global.console.log(c.help)
  },
})

module.exports = c
