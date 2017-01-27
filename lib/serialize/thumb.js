function Thumb(post) {
    const regex = /(!\[.*?]\()(.+?)(\))/
    const config = global.config
    const thumb = post.match(regex)

    if (!thumb) {
        return { thumb: '', post }
    }

    if (config.thumbnail_mode === 1) {
        return {
            thumb: thumb[2].split('"')[0].trim(),
            content: post.replace(thumb[0], ''),
        }
    }
}

module.exports = Thumb
