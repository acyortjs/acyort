const { join } = require('path')
const { existsSync, outputFileSync } = require('fs-extra')

module.exports = function outputHTML({
  template: tag,
  templatePath: tplPath,
  path,
  data,
  engine = 'swig',
}) {
  const { base, public: publicDir, templatePath } = this.config.get()

  if (!templatePath) {
    return
  }

  const methods = this.helper.get()
  const helpers = {}

  let tpl = tplPath
  if (!tpl) {
    tpl = join(templatePath, 'layout', `${tag}.html`)
  }

  if (!existsSync(tpl)) {
    this.logger.error(`Cannot find template: ${tplPath || `${tag}.html`}`)
    return
  }

  Object.keys(methods).forEach((name) => {
    if (Object.prototype.hasOwnProperty.call(methods[name], 'prototype')) { // if bound function
      helpers[name] = methods[name].bind(data)
    } else {
      helpers[name] = methods[name]
    }
  })

  const html = this.renderer.renderFile(engine, tpl, {
    config: this.config.get(),
    page: data,
    ...helpers,
  })

  outputFileSync(join(base, publicDir, path), html)
  this.logger.success(path)
}
