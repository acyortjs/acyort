const pathFn = require('./path')
const Renderer = require('./renderer/')

class Render extends Renderer {
  constructor(config) {
    super(config)
    this.config = config
  }

  getDir(tag) {
    return pathFn.join(this.config[`${tag}_dir`], 'index.html')
  }
}

module.exports = Render
