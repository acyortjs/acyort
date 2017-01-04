const path = require('path')
const config = require('./config')()
const serialize = require('./serialize')
const render = require('./render')
const fetch = require('./fetch')
const json = require('./json')
const { log } = require('./util')

let DATA

function Acyort(liveReoad) {
    let jsonPath = '../source/issues.json'

    if (config.dev || process.env.NODE_ENV === 'dev') {
        if (typeof (config.dev) === 'string') {
            jsonPath = path.join(process.cwd(), config.dev)
        }

        if (liveReoad && DATA) {
            render(DATA, liveReoad)
            return Promise.resolve()
        }

        /* eslint-disable */
        const jsonData = require(jsonPath)
        /* eslint-disable */

        return serialize(jsonData)
            .then((data) => {
                if (liveReoad) {
                    DATA = data
                }

                if (config.json) {
                    return json(data)
                }

                render(data, liveReoad)
                return Promise.resolve()
            })
            .catch(e => log.error(e))
    }

    return fetch()
        .then(res => serialize(res))
        .then(data => {
            if (config.json) {
                return json(data)
            }

            return render(data)
        })
        .catch(e => log.error(e))
}

module.exports = Acyort
