const path = require('path')
const { convert } = require('../util')
const config = require('../config')()

function Category(post) {
    const dir = path.join('/', config.root, convert(config.category_dir))

    if (!post.milestone) {
        return {
            name: config.default_category,
            url: path.join(dir, convert(config.default_category), '/'),
        }
    }

    return {
        name: post.milestone.title,
        url: path.join(dir, convert(post.milestone.title), '/'),
    }
}

module.exports = Category
