const { join } = require('path')
const { Signale } = require('signale')
const { existsSync, outputFileSync } = require('fs-extra')

const logger = new Signale({ interactive: true, scope: 'output' })

module.exports = function outputHTML({
  template: tag,
  path,
  data,
  engine = 'swig',
}) {
  const { base, public: publicDir, templatePath } = this.config

  if (!templatePath) {
    return
  }

  const { methods, defaultMethods } = this.helper
  const tpl = join(templatePath, 'layout', `${tag}.html`)
  const helpers = {}

  if (!existsSync(tpl)) {
    this.logger.error(`Cannot find template: ${tag}.html`)
    return
  }

  Object.keys(methods).forEach((name) => {
    if (!defaultMethods.includes(name)
      && Object.prototype.hasOwnProperty.call(methods[name], 'prototype') // if bound function
    ) {
      helpers[name] = methods[name].bind(data)
    } else {
      helpers[name] = methods[name]
    }
  })

  const html = this.renderer.renderFile(engine, tpl, {
    config: this.config,
    page: data,
    ...helpers,
  })

  outputFileSync(join(base, publicDir, path), html)
  logger.success(path)
}
