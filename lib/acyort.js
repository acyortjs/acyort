const fs = require('fs-extra')
const logger = require('@acyort/logger')()
const Renderer = require('@acyort/renderer')
const { version } = require('../package.json')
const Workflow = require('./workflow')
const Helper = require('./helper')
const Store = require('./store')
const cli = require('./cli')
const copySource = require('./utility/copy')
const processor = require('./utility/processor')
const outputHTML = require('./utility/output')

module.exports = (config) => {
  const acyort = {
    fs,
    version,
    logger,
    renderer: new Renderer(),
    workflow: new Workflow(),
    cli,
    store: new Store(),
  }

  acyort.config = config
  acyort.helper = new Helper(config)
  acyort.process = processor.bind(acyort)
  acyort.outputHTML = outputHTML.bind(acyort)
  acyort.copySource = copySource.bind(acyort)

  return acyort
}
