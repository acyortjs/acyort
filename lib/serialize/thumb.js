const config = require('../config')()
const { getThumb } = require('../util')

function Thumb(post) {
    let content = post
    const thumb = getThumb(post)

    if (!thumb) {
        return { thumb: '', content }
    }

    if (config.thumbnail_mode === 1) {
        content = post.replace(thumb[0], '')
    }

    return { thumb: thumb[2].split('"')[0].trim(), content }
}

module.exports = Thumb
