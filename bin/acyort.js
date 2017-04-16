#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const pkg = require('../package.json')
const { log } = require('../lib/util')

const configPath = path.join(process.cwd(), 'config.yml')
const ignores = 'Thumbs.db .DS_Store *.swp themes/ ISSUE_DATA.json'.split(' ').join('\n')
const commands = 'version init build server clean'
const keeps = 'themes config.yml CNAME README.md'

program
.allowUnknownOption()
.usage('<command>')

program
.command('init [folder]')
.description('Create new blog')
.action((folder = '') => {
  try {
    if (fs.existsSync(configPath)) {
      fs.copySync(configPath, path.join(process.cwd(), 'config.bak.yml'))
    }

    fs.copySync(path.resolve(__dirname, '../assets'), path.join(process.cwd(), folder))
    fs.outputFileSync(path.join(process.cwd(), folder, '.gitignore'), ignores)

    log.done('Configure "config.yml" to start your blog')
  } catch (e) {
    log.error(e)
  }
})

program
.command('version')
.description('Display AcyOrt version')
.action(() => log.info(pkg.version))

program
.command('server [port]')
.description('Create a local test server')
.action((port = 2222) => {
  if (!fs.existsSync(configPath)) {
    return log.error('Cannot find "config.yml"')
  }
  /* eslint-disable */
  const server = require('../lib/server')
  /* eslint-disable */

  return server(port)
})

program
.command('build')
.description('Generate the html')
.action(() => {
  if (!fs.existsSync(configPath)) {
    return log.error('Cannot find "config.yml"')
  }

  /* eslint-disable */
  const build = require('../lib')
  /* eslint-disable */

  return build()
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
