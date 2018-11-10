const logger = require('@acyort/logger')()
const version = require('./commands/version')
const clean = require('./commands/clean')
const init = require('./commands/init')
const flow = require('./commands/flow')

class C {
  constructor() {
    this.commands = []
    this.options = []
  }

  register(type, cli) {
    if (!this[type]) {
      logger.error(`not supports cli type: ${type}`)
      return
    }

    const { name, alias } = cli

    if (
      type === 'option'
      && name.chartAt(0) !== '-'
      && name.chartAt(1) !== '-'
      && alias.chartAt(0) !== '-'
    ) {
      logger.error('option name error')
      return
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

    let help = `
AcyOrt, A Node.js static website framework

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

For more information, check the docs: https://acyort.com
`

    return help
  }
}

const c = new C()

c.register('commands', init)
c.register('commands', flow)
c.register('commands', clean)
c.register('options', version)
c.register('options', {
  name: '--help',
  alias: '-h',
  description: 'Show help',
  action() {
    logger.log(c.help)
  },
})

module.exports = c
