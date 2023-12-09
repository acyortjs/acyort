/**
 * @type {import('acyort').CliCommand}
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
 * @param {import('acyort').AcyOrt} acyort
 */
module.exports = (acyort) => {
  acyort.cli.register('command', server)
}
