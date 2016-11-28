
const yaml = require('yamljs')
const path = require('path')
const url = require('url')

module.exports = function() {
    const config = yaml.load(path.join(process.cwd(), 'config.yml'))
    const _url = url.parse(config.url)

    config.url = _url.protocol +'//'+ _url.host
    config.root = '/'+ path.parse(_url.path).name
    config.public_dir = '/'+ path.parse(config.public_dir).name

    for (let m in config.menu) {
        config.menu[m] = path.join(config.root, config.menu[m])
    }

    config.category_dir = config.category_dir || 'category'
    config.tag_dir = config.tag_dir || 'tag'
    config.post_dir = config.post_dir || 'p'

    return config
}
