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
    }, 1000)
  })
}

function c() {
  acyort.logger.success('c')
}

function e() {
  acyort.process()
}

acyort.workflow.register(b, c, a, e)
