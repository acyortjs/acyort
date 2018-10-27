acyort.cli.register('commands', {
  name: 'test',
  fullName: 'test [cli]',
  description: 'for test',
  action(args) {
    console.log(args)
  }
})

acyort.cli.register('options', {
  name: '--test',
  alias: '-t',
  description: 'test',
  action() {
    console.log('???')
  }
})

acyort.ss.push('???')
