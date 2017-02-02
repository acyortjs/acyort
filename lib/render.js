const pathFn = require('path')
const fs = require('fs-extra')
const { log } = require('./util')
const helperFn = require('./helper')

function Render(path, tpl, content) {
    const config = global.config
    const { languages } = config
    const { helper, urls } = helperFn()

    if (!tpl) {
        return
    }

    languages.forEach((lan, i) => {
        const filePath = pathFn.join(process.cwd(), config.public_dir, (i === 0 ? '' : lan) , path)

        fs.outputFileSync(filePath, tpl(Object.assign(content, helper, urls.i18n[i])))

        if (!global.live) {
            log.done(filePath)
        }
    })
}

module.exports = Render
