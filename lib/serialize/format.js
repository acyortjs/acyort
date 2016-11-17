
// string format

var pinyin = require('pinyin');

module.exports = function() {

    String.prototype.format = function() {
        var t = this.trim().split('/').map(function(s) {
            return pinyin(s, {style: pinyin.STYLE_NORMAL}).join('_')
        })

        return t.join('/').trim().toLowerCase().replace(/\s/g, '_')
    }

}
