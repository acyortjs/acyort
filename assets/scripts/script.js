/* global acyort */

acyort.cli.register('options', {
  name: '--test',
  alias: '-t',
  description: 'Show Test',
  action(argv, acyort) {
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
    }, 300)
  })
}

function c() {
  acyort.logger.success('c')
}

function e() {
  acyort.outputHTML('index', 'index.html', {
    zero: 0,
    other: 10,
  })
  acyort.copySource()
}

acyort.workflow.register(b, c, a, e)

acyort.helper.register('_test', function test() {
  return `<p>${this.zero}|${acyort.config.language}</p>`
})
