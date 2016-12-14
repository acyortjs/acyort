const path = require('path')
const config = require('../config')()
const { convert } = require('../util')

function Tag(post) {
    if (!post.labels.length) {
        return []
    }

    return post.labels.map(label => ({
        name: label.name,
        url: path.join('/', config.root, convert(config.tag_dir), convert(label.name), '/'),
    }))
}

module.exports = Tag
