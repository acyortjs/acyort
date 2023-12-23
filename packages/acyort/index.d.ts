declare module 'acyort' {
  import { Signale } from 'signale'
  import { Arguments } from 'yargs-parser'

  interface Config {
    plugins?: string[],
    scripts?: string[],
    [x: string]: any,
  }

  interface AcyOrt {
    logger: Signale,
    version: string,
    config: Config,
    cwd: string,
    cli: Cli,
  }

  interface CliAction {
    name: string,
    description: string,
    action: (this: AcyOrt, argv: Arguments) => void,
  }

  type CliType = 'command' | 'option'

  interface CliOption extends CliAction {
    alias: string,
  }

  interface CliCommand extends CliAction {}

  interface Cli {
    register: (type: CliType, context: CliCommand | CliOption) => void,
    getOption: (nameOrAlias: string) => CliOption | undefined,
    getCommand: (name: string) => CliCommand | undefined,
    getHelp: () => string,
  }
}
