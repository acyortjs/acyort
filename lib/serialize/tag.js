
// return post tags and origin issue

var totrim = require('./totrim');
var config = require('../config');

module.exports = function(body) {

    var reg = /\<!-- tags:(.*?)--\>/;

    reg = body.match(reg);

    if (!reg) {
        return {
            tags: [],
            body: body
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
        body: body.replace(reg[0], '')
    }

}

