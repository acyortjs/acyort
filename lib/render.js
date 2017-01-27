const pathFn = require('path')
const fs = require('fs-extra')
const moment = require('moment')
const templates = require('./template')
const { log } = require('./util')
const i18nFn = require('./i18n')

function Render(data, config) {
    const { language } = config
    const i18nFn = language.map(lan => i18n(lan))
    const urlFn = language.map((lan, i) => {
        if (i === 0) {
            return function(id) {
                return pathFn.join('/', config.root, config.post_dir, `${id}.html`)
            }
        }

        return function(id) {
            return pathFn.join('/', config.root, lan, config.post_dir, `${id}.html`)
        }
    })

    const render = (path, tpl, content) => {
        if (tpl) {
            const template = templates()
            let filePath = pathFn.join(process.cwd(), config.public_dir, path)

            language.forEach((lan, i) => {
                content.helper.__ = i18nFn[i].__
                content.helper.__n = i18nFn[i].__n
                content.helper.post_url = urlFn[i]

                if (i !== 0) {
                    filePath = pathFn.join(process.cwd(), config.public_dir, lan, path)
                }

                fs.outputFileSync(filePath, template[tpl](content))

                if (!liveReoad) {
                    //log.done(path)
                }
            })
        }
    }

    const helper = {
        //__: i18n.__,
        //__n: i18n.__n,
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

    const mirror = { helper, config }
}

module.exports = Render
