
// get html templates

var fs = require('fs');
var config = require('./config');

module.exports = function(tag) {

    var reg = /@import\(([\s\S]*?)\)/g;

    var tpl = fs.readFileSync(process.cwd() +'/themes/'+ config.theme +'/layout/'+ tag +'.html', 'utf8');

    reg = tpl.match(reg);

    if (!reg) {
        return tpl
    }

    var child = reg.map(function(e) {
        return e.substring('@import'.length + 1, e.length - 1).replace(/\n/g, '')
    })

    child.forEach(function(e, i) {
        e = e.split(',');

        try {
            var frag = fs.readFileSync(process.cwd() +'/themes/'+ config.theme +'/layout/'+ e[0], 'utf8');

            if (e[1]) {
                var obj = JSON.parse(e[1]);
                for (var key in obj) {
                    frag = frag.replace('@'+ key +'@', obj[key])
                }
            }

            tpl = tpl.replace(reg[i], frag);
        } catch(e) {}
    })

    return tpl

}
