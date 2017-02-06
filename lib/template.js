const swig = require('swig-templates')
const pathFn = require('path')

function Template() {
    const templates = {}
    const config = global.config
    const baseDir = pathFn.join(process.cwd(), 'themes', config.theme, 'layout')

    if (config.dev || process.env.NODE_ENV === 'dev') {
        swig.setDefaults({ cache: false })
    }

    'index,archives,categories,category,page,post,tag,tags'
        .split(',')
        .forEach((tag) => {
            try {
                templates[tag] = swig.compileFile(pathFn.join(baseDir, `${tag}.html`))
            } catch (e) {
                //
            }
        })

    return templates
}

module.exports = Template
