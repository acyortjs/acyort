const pathFn = require('path')

function Category(post) {
    const config = global.config

    if (!post.milestone) {
        return {
            id: 0,
            name: config.default_category,
            url: pathFn.join(config.category_dir, '0/'),
        }
    }

    return {
        id: post.milestone.id,
        name: post.milestone.title,
        url: pathFn.join(config.category_dir, post.milestone.id.toString(), '/'),
    }
}

module.exports = Category
