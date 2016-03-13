
// get html templates

var fs = require('fs');

module.exports = function(tag) {

    var re = /@import\((.*)\)/g;
    
    var template = fs.readFileSync('./themes/layout/'+ tag +'.html', 'utf8');

    var t = template.match(re);

    if (!t) {
        return template
    }

    var _t = [];

    t.forEach(function(s, i) {
        _t[i] = t[i].substring('@import'.length + 2, t[i].length - 2)
    })

    _t.forEach(function(s, i) {
        try {
            var frag = fs.readFileSync('./themes/layout/'+ s, 'utf8');
            template = template.replace(t[i], frag);
        } catch(e) {}
    })

    return template

}
