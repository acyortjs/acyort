function Thumb(post) {
    const regex = /(!\[.*?]\()(.+?)(\))/
    const config = global.config
    const thumb = post.match(regex)
    let content = post

    if (!thumb) {
        return { thumb: '', content }
    }

    if (config.thumbnail_mode === 1) {
        content = content.replace(thumb[0], '')
    }

    return { thumb: thumb[2].split('"')[0].trim(), content }
}

module.exports = Thumb
