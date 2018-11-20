const { join } = require('path')
const fs = require('fs-extra')

module.exports = function outputHTML({
  template: tag,
  path,
  data,
  engine = 'swig',
}) {
  const { base, public: publicDir, template } = this.config
  const { methods, defaultMethods } = this.helper
  const tpl = join(base, 'templates', template, 'layout', `${tag}.html`)

  if (!fs.existsSync(tpl)) {
    this.logger.error(`Cannot find template: \`${tpl}\``)
    return
  }

  Object.keys(methods).forEach((name) => {
    if (!defaultMethods.includes(name)) {
      this.helper.methods[name] = methods[name].bind(data)
    }
  })

  const html = this.renderer.renderFile(engine, tpl, {
    config: this.config,
    page: data,
    ...this.helper.methods,
  })

  fs.outputFileSync(join(base, publicDir, path), html)
  this.logger.info(`output: ${path}`)
}
