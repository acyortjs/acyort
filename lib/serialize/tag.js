
// return post tags and origin post

var totrim = require('./totrim');

module.exports = function(post) {

    var reg = /\<!-- tags:(.*?)--\>/;

    reg = post.match(reg);

    if (!reg) {
        return {
            tags: [],
            post: post
        }
    }

    var tags = reg[1].trim().split(',');
    
    tags = tags.map(function(tag) {
        return {
            name: tag,
            url: config.root +'/tag/'+ tag.totrim() +'/'
        }
    })

    return {
        tags: tags,
        post: post.replace(reg[0], '')
    }

}

