const yaml = require('yamljs')
const path = require('path')
const url = require('url')

function Config() {
    const config = yaml.load(path.join(process.cwd(), 'config.yml'))
    const siteurl = url.parse(config.url)
    const siteroot = path.parse(siteurl.path).name

    config.url = `${siteurl.protocol}//${siteurl.host}`
    config.root = siteroot ? `/${siteroot}` : ''
    config.public_dir = config.public_dir || ''
    config.category_dir = config.category_dir || 'category'
    config.tag_dir = config.tag_dir || 'tag'
    config.post_dir = config.post_dir || 'p'

    config.rssPath = config.rss
    config.rss = config.rss ? path.join('/', config.root, config.rss) : ''
    config.favicon = config.favicon ? path.join('/', config.root, config.favicon) : ''
    config.default_category = config.default_category || 'uncategorized'

    config.token = config.token ? config.token.split('#').join('') : ''

    Object.keys(config.menu).forEach((m) => {
        config.menu[m] = path.join('/', config.root, config.menu[m])
    })

    return config
}

module.exports = Config
