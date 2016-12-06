const path = require('path')
const config = require('./config')()
const serialize = require('./serialize')
const render = require('./render')
const fetch = require('./fetch')
const { log } = require('./util')

let DATA

module.exports = function index(liveReoad) {
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
            .catch(e => log.error(e))
    }

    return fetch()
        .then(res => serialize(res))
        .then(data => render(data))
        .catch(e => log.error(e))
}