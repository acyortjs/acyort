
// get html templates

var fs = require('fs');

module.exports = {
    index:      fs.readFileSync('./themes/layout/index.html', 'utf8'), 
    page:       fs.readFileSync('./themes/layout/page.html', 'utf8'), 
    archives:   fs.readFileSync('./themes/layout/archives.html', 'utf8'),
    tag:        fs.readFileSync('./themes/layout/tag.html', 'utf8'),
    post:       fs.readFileSync('./themes/layout/post.html', 'utf8')
}
