const config = require('./config')()
const swig = require('swig-templates')
const path = require('path')

module.exports = function template() {
    const templates = {}

    if (config.dev || process.env.NODE_ENV === 'dev') {
        swig.setDefaults({ cache: false })
    }

    'index,archives,categories,category,page,post,tag,tags'
        .split(',')
        .forEach((tag) => {
            try {
                templates[tag] = swig.compileFile(path.join(process.cwd(), 'themes', config.theme, 'layout', `${tag}.html`))
            } catch (e) {
                //
            }
        })

    return templates
}
