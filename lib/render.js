const pathFn = require('path')
const fs = require('fs-extra')
const moment = require('moment')
const templates = require('./template')
const { log } = require('./util')
const i18nFn = require('./i18n')

function Render(path, tpl, content) {
    const template = templates()
    const config = global.config
    const data = global.data

    if (!template[tpl]) {
        return
    }

    const helper = {
        config,
        url(path) {
            if (!path) {
                return ''
            }
            return pathFn.join(config.root, path)
        },
        time(time, format) {
            return moment(time).format(format)
        },
        post(id) {
            return data.posts.find(post => post.id === id)
        },
        posts() {
            return data.posts.map(post => post.id)
        },
    }

    let baseDir = pathFn.join(process.cwd(), config.public_dir, path)

    fs.outputFileSync(baseDir, template[tpl](Object.assign(content, helper)))

    if (!global.live) {
        log.done(path)
    }
}

module.exports = Render
