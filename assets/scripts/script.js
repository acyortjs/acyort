/* global acyort */

acyort.cli.register('options', {
  name: '--test',
  alias: '-t',
  description: 'Show Test',
  action(argv, acyort) {
    console.log(acyort.config)
  },
})
