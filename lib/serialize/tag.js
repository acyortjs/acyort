
// return post tags and origin issue

var config = require('../config');

require('./format')();

module.exports = function(body) {

    var reg = /\<!-- tags:(.*?) --\>/;

    reg = body.match(reg);

    if (!reg) {
        return []
    }

    var tags = reg[1].trim().split(',');
    
    tags = tags.map(function(tag) {
        return {
            name: tag.trim(),
            url: config.root +'/tag/'+ tag.format() +'/'
        }
    })

    return tags

}

