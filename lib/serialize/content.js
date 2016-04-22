
// return summary and body

var tomark = require('./tomark');

module.exports = function(body) {

    var reg = '<!-- more -->';
    var summary = '';

    if (body.indexOf(reg) > -1) {

        summary = body.split(reg)[0];
        body = body.replace(reg, ''); 

    }

    return {
        summary: tomark(summary),
        body: tomark(body)
    }

}
