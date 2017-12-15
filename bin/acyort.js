#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const { version } = require('../package.json')
const Config = require('acyort-config')
const Render = require('acyort-render')
const Logger = require('acyort-logger')
const Acyort = require('../lib/acyort')

const base = process.cwd()
const logger = new Logger()
const renderer = new Render()
const {
  ignores,
  commands,
  keeps,
} = renderer.render('yaml', { path: path.join(__dirname, 'config.yml') })
const config = new Config({ base, renderer }).value

if (process.env.NODE_ENV === 'dev') {
  config.cache = true
}

program
.allowUnknownOption()
.usage('<command>')

program
.command('init [folder]')
.description('Create new blog')
.action((folder = '') => {
  try {
    if (config) {
      fs.copySync(path.join(base, 'config.yml'), path.join(base, 'config.bak.yml'))
    }

    fs.copySync(path.resolve(__dirname, '../assets'), path.join(base, folder))
    fs.outputFileSync(path.join(base, folder, '.gitignore'), ignores.join('\n'))

    logger.success('Configure "config.yml" to start your blog')
  } catch (e) {
    logger.error(e)
  }
})

program
.command('version')
.description('Display AcyOrt version')
.action(() => console.log(version)) // eslint-disable-line no-console

program
.command('server [port]')
.description('Create a local test server')
.action((port = 2222) => {
  if (!config) {
    logger.error('Cannot find "config.yml" or Configuration information error')
  } else {
    new Acyort(config).start(port)
  }
})

program
.command('build')
.description('Generate the files')
.action(() => {
  if (!config) {
    logger.error('Cannot find "config.yml" or Configuration information error')
  } else {
    new Acyort(config).build()
  }
})

program
.command('clean')
.description('Remove all the generated files')
.action(() => {
  const regex = /(^|\/)\.[^/.]/g

  if (!config) {
    logger.error('Cannot find "config.yml" or Configuration information error')
  } else {
    try {
      const removes = fs
        .readdirSync(base)
        .filter(file => !regex.test(file) && keeps.indexOf(file) === -1)

      removes.forEach(file => fs.removeSync(file))
    } catch (e) {
      logger.error(e)
    }
  }
})

program.parse(process.argv)

if (!program.args.length || commands.indexOf(process.argv[2]) === -1) {
  program.help()
}
