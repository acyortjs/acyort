const config = require('../config')()
const { getThumb } = require('../util')

module.exports = function(content) {
    const thumb = getThumb(content)

    if (!thumb) {
        return { thumb: '', content }
    }

    if (config.thumbnail_mode == 1) {
        content = content.replace(thumb[0], '')
    }

    return { thumb: thumb[2].split('"')[0].trim(), content }
}
