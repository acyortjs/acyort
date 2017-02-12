#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const pkg = require('../package.json')
const { log } = require('../lib/util')

const checker = () => fs.existsSync(path.join(process.cwd(), 'config.yml'))
const err = () => log.error('Cannot find "config.yml"')
const ignore = 'Thumbs.db\n.DS_Store\n*.swp\n.cache/\nthemes/\nconfig.sample.yml'

program
    .allowUnknownOption()
    .usage('<command>')

program
    .command('init [folder]')
    .description('create new blog')
    .action((folder = '') => {
        try {
            log.info('Coping files ...')

            fs.copySync(path.resolve(__dirname, '../assets'), path.join(process.cwd(), folder))
            fs.outputFileSync(path.join(process.cwd(), folder, '.gitignore'), ignore)

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
        if (!checker()) {
            return err()
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
        if (!checker()) {
            return err()
        }
        /* eslint-disable */
        const build = require('../lib')
        /* eslint-disable */
        return build()
    })

program.parse(process.argv)

if (!program.args.length || 'version init build server'.indexOf(process.argv[2]) === -1) {
    program.help()
}
