import { CliOption } from 'acyort'
import cli from './core'

export default {
  name: '--help',
  alias: '-h',
  description: 'show AcyOrt help',
  action() {
    global.console.log(cli.getHelp())
  },
} as CliOption
