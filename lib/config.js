const yaml = require('yamljs')
const path = require('path')
const _url = require('url')

module.exports = function config() {
    const config = yaml.load(path.join(process.cwd(), 'config.yml'))
    const url = _url.parse(config.url)
    const root = path.parse(url.path).name

    config.url = url.protocol +'//'+ url.host
    config.root = root ? '/'+ root : ''
    config.public_dir = config.public_dir || ''
    config.category_dir = config.category_dir || 'category'
    config.tag_dir = config.tag_dir || 'tag'
    config.post_dir = config.post_dir || 'p'

    config.rssPath = config.rss
    config.rss = config.rss ? path.join('/', config.root, config.rss) : ''
    config.favicon = config.favicon ? path.join('/', config.root, config.favicon) : ''
    config.default_category = config.default_category || 'uncategorized'

    config.token = config.token ? config.token.split('#').join('') : ''

    for (let m in config.menu) {
        config.menu[m] = path.join('/', config.root, config.menu[m])
    }

    return config
}
