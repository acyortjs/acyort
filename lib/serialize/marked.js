
// return markdown content

var hl = require('highlight.js');
var marked = require('marked');

module.exports = function(content, unmarked) {

    var renderer = new marked.Renderer();

    renderer.heading = function(text, level) {
        return '<h'+ level +' id="'+ text.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, '-') +'">'+ text +'</h'+ level +'>'
    }

    if (unmarked) {
        renderer.code = function(code, lang, escaped) {
          return '<pre><code>'
            + code
            + '\n</code></pre>\n';
        }
    }

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

    return marked(content)

}
