const { join } = require('path')
const fs = require('fs-extra')
const getTemplates = require('./getTemplate')

module.exports = function outputHTML({
  template: tag,
  path,
  data,
  engine = 'swig',
}) {
  const { base, public: publicDir } = this.config
  const { methods, defaultMethods } = this.helper
  // const tpl = join(base, 'templates', template, 'layout', `${tag}.html`)
  const { path: tpl, root } = getTemplates(this.config, 'layout', `${tag}.html`)
  const helpers = {}

  if (!fs.existsSync(tpl)) {
    this.logger.error(`cannot find template: \`${tpl.split(root)[1]}\``)
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

  fs.outputFileSync(join(base, publicDir, path), html)
  this.logger.info(`output: ${path}`)
}
