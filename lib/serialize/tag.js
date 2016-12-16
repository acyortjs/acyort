const path = require('path')
const config = require('../config')()

function Tag(post) {
    if (!post.labels.length) {
        return []
    }

    return post.labels.map(label => ({
        id: label.id,
        name: label.name,
        url: path.join('/', config.root, config.tag_dir, label.id.toString(), '/'),
    }))
}

module.exports = Tag
