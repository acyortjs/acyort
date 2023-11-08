/**
 * @type {import('../src/types.ts').CliCommand}
 */

const server = {
  name: 'server',
  description: 'start a server',
  action(argv) {
    this.logger.info(this.version)
    this.logger.warn(argv)
  },
}

/**
 * @param {import('../src/core.ts').default} acyort
 */
module.exports = (acyort) => {
  acyort.cli.register('command', server)
}
