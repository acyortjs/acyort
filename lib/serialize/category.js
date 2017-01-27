const pathFn = require('path')

function Category(post) {
    const config = global.config
    const dir = pathFn.join(config.root, config.category_dir)

    if (!post.milestone) {
        return {
            id: 0,
            name: config.default_category,
            url: pathFn.join(dir, '0/'),
        }
    }

    return {
        id: post.milestone.id,
        name: post.milestone.title,
        url: pathFn.join(dir, post.milestone.id.toString(), '/'),
    }
}

module.exports = Category
