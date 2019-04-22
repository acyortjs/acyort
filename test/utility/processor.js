const assert = require('power-assert')
const signale = require('signale')
const processor = require('../../lib/utility/processor')

const logger = {}

Object.keys(signale)
  .filter(key => key.charAt(0) !== '_' && key !== 'Signale')
  .forEach((name) => {
    logger[name] = () => null
  })

describe('processor', () => {
  it('test', async () => {
    const test = []
    const error = []
    const acyort = {
      workflow: {
        scripts: [
          () => new Promise((resolve) => {
            setTimeout(() => {
              test.push('b')
              resolve()
            }, 100)
          }),
          () => test.push('a'),
          () => { throw new Error('error') },
        ],
      },
      logger,
    }

    try {
      await processor.call(acyort)
    } catch (e) {
      error.push(e.message)
    }

    assert(test.join('') === 'ba')
    assert(error.join('') === 'error')

    acyort.workflow.scripts = []

    try {
      await processor.call(acyort)
    } catch (e) {
      error.push(e.message)
    }

    assert(test.join('') === 'ba')
    assert(error.join('') === 'error')
  })
})
