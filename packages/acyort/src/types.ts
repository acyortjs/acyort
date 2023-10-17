import { Arguments } from 'yargs-parser'
import type AcyOrt from '.'

interface CliAction {
  name: string,
  description: string,
  action: (this: AcyOrt, argv: Arguments) => void,
}

export interface Config {
  plugins: string[],
  [x: string]: any,
}

export interface CliOption extends CliAction {
  alias: string,
}

export interface CliCommand extends CliAction {
  fullName: string,
}

export type CliType = 'command' | 'option'
