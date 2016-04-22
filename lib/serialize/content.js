
// return summary and body

var tomark = require('./tomark');

module.exports = function(post) {

    var reg = '<!-- more -->';
    var summary = '';
    var body = post;

    if (post.indexOf(reg) > -1) {

        summary = post.split(reg)[0];
        body = post.replace(reg, ''); 

    }

    return {
        summary: tomark(summary),
        body: tomark(body)
    }

}
