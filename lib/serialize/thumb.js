
// get post thumb
// use the issue first image
// return image url and origin post

var config = require('../config');

module.exports = function(body) {

    var reg = /(!\[.*?\]\()(.+?)(\))/;

    reg = body.match(reg);

    if (!reg) {
        return {
            thumb: '',
            body: body
        }
    }

    if (config.thumbnail_mode == 1) {
        body = body.replace(reg[0], '')
    }

    return {
        thumb: reg[2].split('"')[0].trim(),
        body: body
    }

}
