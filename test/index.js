const assert = require('power-assert')
const config = require('../lib/config')

describe('config', () => {
  it('power-assert', () => {
    assert(config.dev === true)
  })
})
