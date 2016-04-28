
// templates

var config = require('./config');
var colors = require('colors');
var swig = require('swig');

module.exports = function() {

    var templates = {};
    var ignore = '';

    'index,archives,categories,category,page,post,tag,tags'.split(',').forEach(function(tag) {

        var template;

        try {
            template = swig.compileFile(process.cwd() +'/themes/'+ config.theme +'/layout/'+ tag +'.html')
        } catch(err) {
            ignore += tag +', ';
            template = '';
        }

        templates[tag] = template

    })

    if (ignore) {
        console.log('Warn: '.yellow +'missing templates: ['+ ignore.substr(0, ignore.length - 2) +']')
    }

    return templates

}
