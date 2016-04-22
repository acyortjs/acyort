
// get post thumb
// use the issue first image
// return image url and origin post

var config = require('../config');

module.exports = function(post) {

    var reg = /(!\[.*?\]\()(.+?)(\))/;

    reg = post.match(reg);

    if (!reg) {
        return {
            thumb: '',
            post: post
        }
    }

    if (config.thumbnail_mode == 1) {
        post = post.replace(reg[0], '')
    }

    return {
        thumb: reg[2].split('"')[0].trim(),
        post: post
    }

}
