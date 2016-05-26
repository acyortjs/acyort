
// return post tags and origin issue

var config = require('../config');

module.exports = function(body) {

    var customs = {};

    config.customs.forEach(function(custom) {

        var reg = new RegExp('\\<!-- '+ custom +':(.*?) --\\>');

        reg = body.match(reg);

        customs[custom] = reg ? reg[1].trim() : ''

    })

    return customs

}

