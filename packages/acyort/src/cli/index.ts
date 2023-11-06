import yargs from 'yargs-parser'
import cli from './core'
import versionOption from './version'
import helpOption from './help'
import type AcyOrt from '../core'

cli.register('option', versionOption)
cli.register('option', helpOption)

export default (processArgv: string[], acyort?: AcyOrt) => {
  const argv = yargs(processArgv)

  if (acyort) {
    const command = cli.getCommand(argv._[0] as string)
    if (command) {
      command.action.call(acyort, argv)
      return
    }

    const optionKeys = Object.keys(argv)
    for (let i = 0; i < optionKeys.length; i += 1) {
      const option = cli.getOption(optionKeys[i])
      if (option) {
        option.action.call(acyort, argv)
        return
      }
    }
  }

  helpOption.action.call({} as AcyOrt, argv)
}
