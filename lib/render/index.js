const pathFn = require('./path')
const Renderer = require('./renderer/')
const Helper = require('./helper/')

class Render extends Renderer {
  constructor(config, posts) {
    super(config)

    this.config = config
    this.helper = new Helper(config, posts)
  }

  getDir(tag) {
    return pathFn.join(this.config[`${tag}_dir`], 'index.html')
  }
}

module.exports = Render
