
// mkdir

var fs = require('fs');

module.exports = function() {
    Array.prototype.slice.call(arguments).forEach(function(e) {
        if (!fs.existsSync(e)) {
            fs.mkdirSync(e)
        }
    })
}
