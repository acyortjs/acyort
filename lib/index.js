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
            return render(DATA, liveReoad)
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

                return render(data, liveReoad)
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
