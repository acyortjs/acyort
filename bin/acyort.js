#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const pkg = require('../package.json')
const Logger = require('../lib/logger')
const Server = require('../lib/server')
const Acyort = require('../lib/acyort')

const yml = path.join(process.cwd(), 'config.yml')
const ignores = 'Thumbs.db .DS_Store *.swp themes/ ISSUE_DATA.json'.split(' ').join('\n')
const commands = 'version init build server clean'
const keeps = 'themes config.yml CNAME README.md LICENSE ISSUE_DATA.json favicon.ico'
const logger = new Logger()
const server = new Server()
const acyort = new Acyort()

program
.allowUnknownOption()
.usage('<command>')

program
.command('init [folder]')
.description('Create new blog')
.action((folder = '') => {
  try {
    if (fs.existsSync(yml)) {
      fs.copySync(yml, path.join(process.cwd(), 'config.bak.yml'))
    }

    fs.copySync(path.resolve(__dirname, '../assets'), path.join(process.cwd(), folder))
    fs.outputFileSync(path.join(process.cwd(), folder, '.gitignore'), ignores)

    logger.success('Configure "config.yml" to start your blog')
  } catch (e) {
    logger.error(e)
  }
})

program
.command('version')
.description('Display AcyOrt version')
.action(() => logger.info(pkg.version))

program
.command('server [port]')
.description('Create a local test server')
.action((port = 2222) => {
  if (!fs.existsSync(yml)) {
    logger.error('Cannot find "config.yml"')
  } else {
    server.start()
  }
})

program
.command('build')
.description('Generate the files')
.action(() => {
  if (!fs.existsSync(yml)) {
    logger.error('Cannot find "config.yml"')
  } else {
    acyort.start()
  }
})

program
.command('clean')
.description('Remove all the generated files')
.action(() => {
  let files = fs.readdirSync(process.cwd())

  files = files.filter((file) => {
    if ((/(^|\/)\.[^\/\.]/g).test(file)) {
      return false
    }
    if (keeps.indexOf(file) > -1) {
      return false
    }
    return true
  })

  files.forEach(file => fs.removeSync(file))
})

program.parse(process.argv)

if (!program.args.length || commands.indexOf(process.argv[2]) === -1) {
  program.help()
}
