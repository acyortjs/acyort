const pathFn = require('path')
const fs = require('fs-extra')
const { log } = require('./util')

function Render(path, tpl, content) {
  const config = global.config

  if (!tpl) {
    return
  }

  const filePath = pathFn.join(process.cwd(), config.public_dir, path)
  fs.outputFileSync(filePath, tpl(content))

  if (!global.live) {
    log.done(filePath)
  }
}

module.exports = Render
