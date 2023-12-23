import { AcyOrt } from 'acyort'

export default (acyort: AcyOrt) => {
  acyort.cli.register('command', {
    name: 'pigeon',
    description: 'static website plugin',
    action() {
      this.logger.info(this.version)
    },
  })
}
