const path = require('path')
const { getTags, convert } = require('../util')
const config = require('../config')()

function Tag(post) {
    let content = post
    let tags = getTags(post)

    if (!tags) {
        return { tags: [], content }
    }

    content = post.replace(tags[0], '')

    tags = tags[1]
        .trim().split(',')
        .map(tag => ({
            name: tag.trim(),
            url: path.join('/', config.root, convert(config.tag_dir), convert(tag), '/'),
        }))

    return { tags, content }
}

module.exports = Tag
