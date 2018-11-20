module.exports = (acyort) => {
  acyort.cli.register('options', {
    name: '--test',
    alias: '-t',
    description: 'Show Test',
    action() {
      acyort.logger.info(acyort.config)
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
      }, 1000)
    })
  }

  function c() {
    acyort.logger.success('c')
  }

  function e() {
    acyort.outputHTML({
      template: 'index',
      path: 'index.html',
      data: {
        zero: 0,
        other: 10,
      },
    })
    acyort.copySource()
  }

  acyort.store.set('test', { test: 1 })

  acyort.workflow.register(b, c, a, e)

  acyort.helper.register('_test', function test() {
    global.console.log(acyort.store.get('test'))
    return `<p>${this.zero}|${acyort.config.language}</p>`
  })
}
