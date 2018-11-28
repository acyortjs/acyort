const assert = require('power-assert')
const cli = require('../lib/cli')

describe('cli', () => {
  it('test', () => {
    const commands = []

    cli.register('unknows')
    assert(cli.commands.length === 0)
    assert(cli.options.length === 0)

    cli.register('commands', {
      name: 'test',
      action(s) { commands.push(s) },
    })

    cli.getAction('commands', 'test')('a')
    assert(commands.join('') === 'a')

    cli.register('options', {
      name: '--ver',
      alias: '-v',
      action(s) { commands.push(s) },
    })

    cli.getAction('options', '--ver')('b')
    assert(commands.join('') === 'ab')

    cli.getAction('options', '-v')('c')
    assert(commands.join('') === 'abc')

    assert(cli.commands.length === 1)
    assert(cli.options.length === 1)

    assert(cli.getAction('options', '-s') === undefined)
    assert(cli.getAction('commands') === undefined)

    cli.register('options', {
      name: '-ss',
      alias: '-v',
    })

    cli.register('options', {
      name: '--ss',
      alias: 's',
    })

    assert(cli.options.length === 1)
  })
})
