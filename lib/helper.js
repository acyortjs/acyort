const i18nFn = require('./i18n')
const pathFn = require('path')
const moment = require('moment')

function Helper() {
    const config = global.config
    const data = global.data
    const { languages } = config
    const i18n = []
    const post_url = []
    const tag_url = []
    const category_url = []

    const time = (time, format) => moment(time).format(format)
    const post = id => data.posts.find(post => post.id === id)
    const posts = () => data.posts.map(post => post.id)

    const assets_url = (path) => {
        if (!path) {
            return ''
        }
        return pathFn.join(config.root, path)
    }

    languages.forEach((lan, i) => {
        i18n.push(i18nFn(lan))

        if (i === 0) {
            post_url.push((id) => pathFn.join(config.root, config.post_dir, `${id}.html`))
            tag_url.push((id) => pathFn.join(config.root, config.tag_dir, `${id}/`))
            category_url.push((id) => pathFn.join(config.root, config.category_dir, `${id}/`))
        } else {
            post_url.push((id) => pathFn.join(config.root, lan, config.post_dir, `${id}.html`))
            tag_url.push((id) => pathFn.join(config.root, lan, config.tag_dir, `${id}.html`))
            category_url.push((id) => pathFn.join(config.root, lan, config.category_dir, `${id}.html`))
        }
    })

    return {
        helper: { config, time, post, posts, assets_url },
        urls: { i18n, post_url, tag_url, category_url }
    }
}

module.exports = Helper
