import { CliCommand, CliOption, CliType } from '../types'

export default class {
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
}
