
const path = require('path')
const config = require('../config')()
const { textTransform, getTags } = require('../util')

textTransform()

module.exports = function(content) {

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
                url: path.join(config.root, config.tag_dir.transform(), tag.transform(), '/')
            }
        })

    return { tags, content }

}

