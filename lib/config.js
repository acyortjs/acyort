
const yaml = require('yamljs')

module.exports = function() {

    const config = yaml.load(process.cwd() +'/config.yml')

    config.url = config.url.split('/').filter(s => s !== '').join('/')
    config.root = '/'+ (config.url.split('://')[1].split('/')[1] || '')
    config.public_dir = (config.public_dir || '').replace(/\//g, '')

    for (let m in config.menu) {
        config.menu[m] = config.root + config.menu[m]
    }

    config.category_dir = config.category_dir || 'category'
    config.tag_dir = config.tag_dir || 'tag'

    return config

}
