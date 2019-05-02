module.exports = (acyort) => {
  acyort.cli.register('options', {
    name: '--config',
    alias: '-c',
    description: 'Show config',
    action(argv) {
      acyort.logger.log('CLI arguments: ', argv, '\n')
      acyort.logger.info(acyort.config.get())
    },
  })

  function a() {
    acyort.logger.log(acyort.version)
  }

  function b() {
    return new Promise((resolve) => {
      setTimeout(() => {
        acyort.logger.info('b')
        resolve()
      }, 300)
    })
  }

  function c() {
    acyort.logger.success('c')
  }

  function d() {
    acyort.util.outputHTML({
      template: 'index',
      path: 'index.html',
      data: {
        zero: 0,
        one: 1,
        other: 10,
      },
    })
    acyort.util.copySource()
  }

  function e() {
    throw new Error('e')
  }

  acyort.store.set('key', 5)

  acyort.workflow.register(a, b, c, d, e)

  acyort.helper.register('_h5', function h5() {
    const key = acyort.store.get('key')
    const number = this.one
    return `This is h${key}, not h${number}`
  })
}
