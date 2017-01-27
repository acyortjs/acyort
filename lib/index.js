const pathFn = require('path')
const config = require('./config')()
const serialize = require('./serialize')
/*
const render = require('./render')
const fetch = require('./fetch')
const json = require('./json')
const { log } = require('./util')
*/

function Acyort() {
    if (process.env.NODE_ENV === 'dev') {
        config.dev = true
    }

    if (typeof config.dev === 'string') {
        config.source = pathFn.join(process.cwd(), config.dev)
    }

    global.config = config

    if (config.dev) {
        if (global.live && global.data) {
            // build(global.data)
            return Promise.resolve()
        }

        /* eslint-disable */
        const json = require(config.source)
        /* eslint-disable */

        return serialize(json)
        .then((data) => {
            console.log(data)
        })
    }


    if (config.dev || process.env.NODE_ENV === 'dev') {
        if (typeof (config.dev) === 'string') {
            jsonPath = path.join(process.cwd(), config.dev)
        }

        if (liveReoad && DATA) {
            render(DATA, liveReoad)
            return Promise.resolve()
        }


        return serialize(jsonData, config)
            .then((data) => {
                if (liveReoad) {
                    DATA = data
                }

                if (config.json) {
                    return json(data)
                }

                //render(data, liveReoad)
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
