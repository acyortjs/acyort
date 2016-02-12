
// get html templates

var fs = require('fs');

module.exports = {
    index:      fs.readFileSync('./templates/index.html', 'utf8'), 
    page:       fs.readFileSync('./templates/page.html', 'utf8'), 
    archives:   fs.readFileSync('./templates/archives.html', 'utf8'),
    tag:        fs.readFileSync('./templates/tag.html', 'utf8'),
    post:       fs.readFileSync('./templates/post.html', 'utf8')
}
