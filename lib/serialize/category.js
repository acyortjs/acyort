const path = require('path')
const config = require('../config')()
const { convert } = require('../util')

module.exports = function category(post) {
    if (!post.labels.length) {
        return [{
            name: config.default_category,
            url: path.join('/', config.root, convert(config.category_dir), convert(config.default_category), '/')
        }]
    }

    return post.labels.map(label => {
        return {
            name: label.name, 
            url: path.join('/', config.root, convert(config.category_dir), convert(label.name), '/')
        }
    })
}
