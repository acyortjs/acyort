import { CliOption } from '../types'

export default {
  name: '--version',
  alias: '-v',
  description: 'print AcyOrt version',
  action() {
    const { version: nodeVersion, platform, arch } = process
    global.console.log(`acyort: ${this.version}
node: ${nodeVersion}
os: ${platform} ${arch}`)
  },
} as CliOption
