
// match tags
// return [tags array, post]

module.exports = function(post) {

    var reg = /\<!-- tags:(.*)--\>/;

    reg = post.match(reg)

    if (!reg) {
        return [[], post]
    }

    var tags = reg[1].trim().split(',');
    
    tags = tags.map(function(tag) {
        return tag.trim()
    })

    post = post.replace(reg[0], '')

    return [tags, post]

}

