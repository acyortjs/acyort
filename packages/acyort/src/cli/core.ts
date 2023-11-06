import { CliCommand, CliOption, CliType } from '../types'

class Cli {
  private commands: CliCommand[]

  private options: CliOption[]

  constructor() {
    this.commands = []
    this.options = []
  }

  register(type: CliType, context: CliCommand | CliOption) {
    if (type !== 'command' && type !== 'option') {
      throw new Error(`not supports type: ${type}`)
    }

    if (type === 'option') {
      const { name, alias } = context as CliOption
      if (!name.startsWith('--') || !alias.startsWith('-')) {
        throw new Error(`option error: ${name}, ${alias}`)
      }

      const optionExist = this.options.find((o) => o.name === name || o.alias === alias)

      if (optionExist) {
        throw new Error(`option exists: ${name}, ${alias}`)
      }

      this.options.push(context as CliOption)
    }

    if (type === 'command') {
      const commandExist = this.commands.find((c) => c.name === context.name)
      if (commandExist) {
        throw new Error(`option exists: ${context.name}`)
      }

      this.commands.push(context as CliCommand)
    }
  }

  getOption(nameOrAlias: string) {
    return this.options
      .find((o) => o.alias.slice(1) === nameOrAlias || o.name.slice(2) === nameOrAlias)
  }

  getCommand(name: string) {
    return this.commands.find((c) => c.name === name)
  }

  getHelp() {
    const { commands, options } = this
    const width = 24

    let help = `
AcyOrt, A Node.js extensible framework

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

For more information, check the docs: https://acyort.js.org
`
    return help
  }
}

export default new Cli()
