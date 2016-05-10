
// create table content, via Hexo

var reg = /<h(\d)(.*?)>(.+?)<\/h\d>/g;
var _reg = /<h(\d).*id="(.+?)".*>(.+?)<\/h\d>/;

module.exports = function(body) {

    var data = [];
    var html = '<ul class="toc">';
    var lastNumber = {};
    var firstLevel = 0;
    var lastLevel = 0;

    var headings = body.match(reg);

    if (!headings || !headings.length) {
        return ''
    }

    for (var i = 1; i <= 6; i ++) {
        lastNumber[i] = 0
    }

    headings.forEach(function(heading, i) {
        if (!_reg.test(heading)) {
            return
        }

        var match = heading.match(_reg);

        data.push({
            level: +match[1],
            id: match[2],
            text: match[3]
        })
    })

    data.forEach(function(item) {
        var level = item.level;
        var number = '';

        if (!firstLevel) {
            firstLevel = level;
            lastLevel = level;
        }

        lastNumber[level] ++;

        for (var i = level + 1; i <= 6; i ++) {
            lastNumber[i] = 0;
        }

        for (var i = level; i < lastLevel; i ++) {
            html += '</ul>'
        }

        if (level > lastLevel) {
            html += '<ul>'
        }

        number += '<span>';
        for (var i = firstLevel; i <= level; i ++) {
            number += lastNumber[i] +'.'
        }
        number += '</span>';

        html += '<li class="level-'+ level +'">'+
                '<a href="#'+ item.id +'">'+ number +'<span>'+ item.text +'</span></a>'+
                '</li>';

        lastLevel = level;
    })

    html += '</ul>';

    return html

}
