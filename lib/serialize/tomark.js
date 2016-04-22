
// return markdown content

var hl = require('highlight.js');
var marked = require('marked');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
        return hl.highlightAuto(code).value
    }
})

module.exports = function(content) {

    return marked(content)

}
