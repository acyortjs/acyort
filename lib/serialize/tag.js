const path = require('path')
const { getTags, convert } = require('../util')
const config = require('../config')()

module.exports = function tag(content) {
    let tags = getTags(content)

    if (!tags) {
        return { tags: [], content }
    }

    content = content.replace(tags[0], '')

    tags = tags[1]
        .trim().split(',')
        .map(tag => ({
            name: tag.trim(),
            url: path.join('/', config.root, convert(config.tag_dir), convert(tag), '/')
        })

    return { tags, content }
}
