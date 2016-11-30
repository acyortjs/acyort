const colors = require('colors')
const path = require('path')
const config = require('./config')()
const serialize = require('./serialize')
const render = require('./render')
const fetch = require('./fetch')

let DATA

module.exports = function(liveReoad) {
    let json = '../test/issues.json'

    if (config.dev || process.env.NODE_ENV == 'dev') {
        if (typeof(config.dev) == 'string') {
            json = path.join(process.cwd(), config.dev)
        }

        if (liveReoad && DATA) {
            return render(DATA, liveReoad)
        }

        return serialize(require(json))
            .then(data => {
                if (liveReoad) {
                    DATA = data
                }

                render(data, liveReoad)
            })
    }

    return fetch()
        .then(res => serialize(res))
        .then(data => render(data))
        .catch(err => console.log('\u00D7'.red, err))
}