#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const pkg = require('../package.json')
const yaml = require('yamljs')
const Logger = require('../lib/logger')
const Server = require('../lib/server')
const Acyort = require('../lib/acyort')

const logger = new Logger()
const server = new Server()
const acyort = new Acyort()
const { ignores, commands, keeps } = yaml.load(path.join(__dirname, 'config.yml'))

function check() {
  const yml = path.join(process.cwd(), 'config.yml')
  if (fs.existsSync(yml)) {
    return yml
  }
  return false
}

program
.allowUnknownOption()
.usage('<command>')

program
.command('init [folder]')
.description('Create new blog')
.action((folder = '') => {
  try {
    if (check()) {
      fs.copySync(check(), path.join(process.cwd(), 'config.bak.yml'))
    }

    fs.copySync(path.resolve(__dirname, '../assets'), path.join(process.cwd(), folder))
    fs.outputFileSync(path.join(process.cwd(), folder, '.gitignore'), ignores.join('\n'))

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
  if (!check()) {
    logger.error('Cannot find "config.yml"')
  } else {
    server.init(port)
  }
})

program
.command('build')
.description('Generate the files')
.action(() => {
  if (!check()) {
    logger.error('Cannot find "config.yml"')
  } else {
    acyort.init()
  }
})

program
.command('clean')
.description('Remove all the generated files')
.action(() => {
  try {
    const files = fs.readdirSync(process.cwd()).filter((file) => {
      if ((/(^|\/)\.[^\/\.]/g).test(file) || keeps.indexOf(file) > -1) {
        return false
      }
      return true
    })

    files.forEach(file => fs.removeSync(file))
  } catch (e) {
    logger.error(e)
  }
})

program.parse(process.argv)

if (!program.args.length || commands.indexOf(process.argv[2]) === -1) {
  program.help()
}
