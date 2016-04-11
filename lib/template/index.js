
// get html templates

var tpl = require('./tpl');

module.exports = function() {

    var templates = {};

    'index,archives,categories,category,page,post,tag,tags'.split(',').forEach(function(e) {
        templates[e] = tpl(e)
    })

    return templates

}
