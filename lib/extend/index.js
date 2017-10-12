const fs = require('fs-extra')
const path = require('path')

class Extend {
  constructor(config) {
    this._scripts = config.scripts
    this._functions = {
      after_get_data: [],
      after_process_data: [],
      after_post_render: [],
    }
    this._types = [
      'after_get_data',
      'after_process_data',
      'after_post_render',
    ]
  }

  register(type, fn) {
    if (this._types.indexOf(type) > -1) {
      this._functions[type].push(fn)
    }
  }
}

module.exports = Extend
