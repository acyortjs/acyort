
const config = require('./config')()
const colors = require('colors')
const swig = require('swig-templates')

module.exports = function() {

    const templates = {}

    if (config.dev || process.env.NODE_ENV == 'dev') {
        swig.setDefaults({ cache: false })    
    }

    'index,archives,categories,category,page,post,tag,tags'.split(',').forEach(tag => {
        try {
            templates[tag] = swig.compileFile(process.cwd() +'/themes/'+ config.theme +'/layout/'+ tag +'.html')
        } catch(e) {}
    )

    return templates

}
