const assert = require('power-assert')
const expect = require('expect')
const cli = require('../lib/cli')

describe('cli', () => {
  it('test', () => {
    const commands = []

    expect(() => cli.register('unknows'))
      .toThrow('Not supports cli type: unknows')

    cli.register('commands', {
      name: 'test',
      action(s) { commands.push(s) },
    })

    cli.register('commands', {
      name: 'test1',
      action(s) { commands.push(s) },
    })

    cli.getAction('commands', 'test')('a')
    assert(commands.join('') === 'a')

    cli.getAction('commands', 'test1')('a')
    assert(commands.join('') === 'aa')

    cli.register('options', {
      name: '--ver',
      alias: '-v',
      action(s) { commands.push(s) },
    })

    cli.getAction('options', '--ver')('b')
    assert(commands.join('') === 'aab')

    cli.getAction('options', '-v')('c')
    assert(commands.join('') === 'aabc')

    assert(cli.commands.length === 2)
    assert(cli.options.length === 1)

    assert(cli.getAction('options', '-s') === undefined)
    assert(cli.getAction('commands') === undefined)

    expect(() => cli.register('options', { name: '-ss', alias: '-v' }))
      .toThrow('Option register error, name: -ss, alias: -v')

    expect(() => cli.register('options', { name: '--ss', alias: 's' }))
      .toThrow('Option register error, name: --ss, alias: s')

    expect(() => cli.register('options', { name: '--ver', alias: '-s' }))
      .toThrow('Register error, options: --ver | -s currently exists')

    expect(() => cli.register('options', { name: '--vers', alias: '-v' }))
      .toThrow('Register error, options: --vers | -v currently exists')

    expect(() => cli.register('commands', { name: 'test' }))
      .toThrow('Register error, commands: test currently exists')
  })
})
