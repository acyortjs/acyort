const assert = require('power-assert')
const signale = require('signale')
const logger = require('../lib/logger')

describe('logger', () => {
  it('test', () => {
    const keys = Object.keys(signale)
      .filter(key => key.charAt(0) !== '_' && key !== 'Signale')

    assert(Object.keys(logger).join() === keys.join())
    assert(
      Object.keys(logger())
        .filter(key => key.charAt(0) !== '_')
        .join() === keys.join(),
    )
  })
})
