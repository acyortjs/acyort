#!/usr/bin/env node

'use strict';

const program = require('commander')
const fs = require('fs-extra')
const colors = require('colors')
const pkg = require('../package.json')

const commands = 'version create build server'
const ignore = 'Thumbs.db\n.DS_Store\n*.swp\n.cache/\nthemes/'

program
    .allowUnknownOption()
    .usage('<command>')

program
    .command('create [folder]')
    .description('create new blog')
    .action((folder = '') => {
        console.log('Coping files...')

        try {
            fs.copySync('../assets', process.cwd() +'/'+ folder)
            fs.outputFileSync(process.cwd() +'/'+ folder +'/.gitignore', ignore)
        } catch (e) {
            console.log('ERROR:'.red, e)
        }

        console.log('Done.'.green, 'Modify "config.yml" to configure your blog')
    })

program
    .command('version')
    .description('Display AcyOrt version')
    .action(() => console.log(pkg.version.green))

program
    .command('server [port]')
    .description('Create a local test server')
    .action((port = 2222) => {
        try {
            require('../lib/server')(port)
        } catch(e) {
            console.log('ERROR:'.red, e)
        }
    })

program
    .command('build')
    .description('Build the blog html')
    .action(() => {
        try {
            require('../lib/acyort')()
        } catch(e) {
            console.log('ERROR:'.red, e)
        }
    })

program.parse(process.argv)

if (!program.args.length || commands.indexOf(process.argv[2]) == -1) {
    program.help()
}
