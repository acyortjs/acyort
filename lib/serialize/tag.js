
// match tags
// return [tags array, match string]

module.exports = function(post) {

    var reg = /\<!-- tags:(.*)--\>/;

    reg = post.match(reg)

    if (!reg) {
        return []
    }

    var tags = reg[1].trim().split(',');
    
    tags = tags.map(function(tag) {
        return tag.trim()
    })

    return [tags, reg[0]]

}

