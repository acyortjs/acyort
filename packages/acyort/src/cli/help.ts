import cli from './core'
import { CliOption } from '../types'

export default {
  name: '--help',
  alias: '-h',
  description: 'show AcyOrt help',
  action() {
    global.console.log(cli.getHelp())
  },
} as CliOption
