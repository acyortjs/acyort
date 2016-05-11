
// return markdown content

var hl = require('highlight.js');
var marked = require('marked');
var renderer = new marked.Renderer();

marked.setOptions({
    renderer: renderer,
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

renderer.heading = function(text, level) {
    return '<h'+ level +' id="'+ text.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, '-') +'">'+ text +'</h'+ level +'>'
}

module.exports = function(content) {

    return marked(content)

}
