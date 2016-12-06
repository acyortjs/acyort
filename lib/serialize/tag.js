const path = require('path')
const { getTags } = require('../util')
const config = require('../config')()

module.exports = function tag(content) {
    let tags = getTags(content)

    if (!tags) {
        return { tags: [], content }
    }

    content = content.replace(tags[0], '')

    tags = tags[1]
        .trim().split(',')
        .map(tag => {
            return {
                name: tag.trim(),
                url: path.join('/', config.root, config.tag_dir.transform(), tag.transform(), '/')
            }
        })

    return { tags, content }
}
