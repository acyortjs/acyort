
// post summary and post content
// return [summary, body]

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

module.exports = function(post) {

    var reg = '<!-- more -->';
    var summary = '';
    var body = post;

    if (post.indexOf(reg) > -1) {
        summary = post.split(reg)[0];
        body = post.replace(reg, ''); 
    }

    return [marked(summary), marked(body)]

}
