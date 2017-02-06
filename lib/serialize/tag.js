const pathFn = require('path')

function Tag(post) {
    const config = global.config

    if (!post.labels.length) {
        return []
    }

    return post.labels.map(label => ({
        id: label.id,
        name: label.name,
        url: pathFn.join(config.tag_dir, label.id.toString(), '/'),
    }))
}

module.exports = Tag
