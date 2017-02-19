const pathFn = require('path')
const config = require('./config')()
const serialize = require('./serialize')
const build = require('./build')
const feed = require('./feed')
const source = require('./source')
const jsonFn = require('./json')
const { log } = require('./util')
const fetch = require('./fetch')

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
            build(global.data)
            return Promise.resolve()
        }

        /* eslint-disable */
        const json = require(config.source)
        /* eslint-disable */

        return serialize(json)
        .then((data) => {
            global.data = data

            if (config.json) {
                jsonFn(data)
            }

            if (!global.live) {
                source()
                feed(data.posts)
            }

            build(data)

            return Promise.resolve()
        })
        .catch(e => log.error(e))
    }

    return fetch()
    .then(res => serialize(res))
    .then((data) => {
        global.data = data

        if (config.json) {
            return jsonFn(data)
        }

        if (!global.live) {
            source()
            feed(data.posts)
        }

        return build(data)
    })
    .catch(e => log.error(e))
}

module.exports = Acyort
