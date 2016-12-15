const path = require('path')
const config = require('../config')()

function Category(post) {
    const dir = path.join('/', config.root, config.category_dir)

    if (!post.milestone) {
        return {
            id: 0,
            name: config.default_category,
            url: path.join(dir, '0/'),
        }
    }

    return {
        id: post.milestone.id,
        name: post.milestone.title,
        url: path.join(dir, post.milestone.id, '/'),
    }
}

module.exports = Category
