const yaml = require('yamljs')
const path = require('path')
const url = require('url')
const { strFormat } = require('./util')

function Config() {
    const config = yaml.load(path.join(process.cwd(), 'config.yml'))
    const siteurl = url.parse(config.url)
    const siteroot = path.parse(siteurl.path).name

    config.url = `${siteurl.protocol}//${siteurl.host}`
    config.root = siteroot ? `/${siteroot}` : ''

    config.public_dir = strFormat(config.public_dir || '')
    config.category_dir = strFormat(config.category_dir || 'category')
    config.tag_dir = strFormat(config.tag_dir || 'tag')
    config.post_dir = strFormat(config.post_dir || 'posts')
    config.archives_dir = strFormat(config.archives_dir || 'archives')
    config.default_category = config.default_category || 'uncategorized'

    config.language = config.language || ['default']
    config.rss = config.rss ? path.join('/', config.root, config.rss) : ''
    config.favicon = config.favicon ? path.join('/', config.root, config.favicon) : ''

    config.per_page = config.per_page || 0
    config.archives_per_page = config.archives_per_page || 0

    config.token = config.token ? config.token.split('#').join('') : ''

    Object.keys(config.menu).forEach((m) => {
        config.menu[m] = path.join('/', config.root, config.menu[m])
    })

    return config
}

module.exports = Config
