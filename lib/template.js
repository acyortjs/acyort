
// templates

var fs = require('fs');
var config = require('./config');
var colors = require('colors');

module.exports = function() {

    var templates = {};

    'index,archives,categories,category,page,post,tag,tags'.split(',').forEach(function(tag) {

        var template;

        try {
            template = fs.readFileSync(process.cwd() +'/themes/'+ config.theme +'/layout/'+ tag +'.html', 'utf8')
        } catch(err) {
            console.log('Info: '.blue +'ignore template: ['+ tag +']')
            template = ''
        }

        templates[tag] = template

    })

    return templates

}
