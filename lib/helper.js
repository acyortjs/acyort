const i18nFn = require('./i18n')
const pathFn = require('path')
const moment = require('moment')

function Helper() {
    const config = global.config
    const data = global.data
    const { languages } = config
    const i18n = []
    const urls = []

    const time = (t, format) => moment(t).format(format)
    const post = id => data.posts.find(p => p.id === id)
    const posts = () => data.posts.map(p => p.id)

    const source = (path) => {
        if (!path) {
            return ''
        }
        return pathFn.join(config.root, path)
    }

    languages.forEach((lan, i) => {
        i18n.push(i18nFn(lan))
        urls.push({ url(path) { return pathFn.join(config.root, (i === 0 ? '' : lan), path) } })
    })

    return { helper: { config, time, post, posts, source }, i18n, urls }
}

module.exports = Helper
