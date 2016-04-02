
// get post thumb
// the issue first image
// return [image url, post]

var config = require('../config');

module.exports = function(post) {

    var reg = /(!\[.*?\]\()(.+?)(\))/;

    reg = post.match(reg);

    if (!reg) {
        return ['', post]
    }

    if (config.thumbnail_mode == 1) {
        post = post.replace(reg[0], '')
    }

    return [reg[2].split('"')[0].trim(), post]

}
