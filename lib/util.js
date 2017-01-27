const axios = require('axios')
const chalk = require('chalk')

/* eslint-disable no-console */
const clog = console.log
/* eslint-disable no-console */

const api = (user, repo) => `https://api.github.com/repos/${user}/${repo}/issues`

axios.defaults.headers['User-Agent'] = 'AcyOrt'

const fetch = (user, repo, data = {}) => {
    const args = Object.keys(data).map(arg => `${arg}=${data[arg]}`).join('&')
    const url = `${api(user, repo)}?${args}`

    return axios.get(url).then(res => res)
}

const strFormat = str => str.trim().toLowerCase().replace(/\s/g, '_')

const objDelete = (o, ...keys) => {
    const obj = JSON.parse(JSON.stringify(o))
    keys.forEach(key => delete obj[key])
    return obj
}

const objFrom = (o, ...keys) => {
    const obj = {}
    keys.forEach(key => (obj[key] = o[key]))
    return obj
}

const log = {
    error(s) {
        clog(chalk.red('\u2716'), s)
    },
    done(s) {
        clog(chalk.green('\u2714'), s)
    },
    info(s, t = '') {
        clog(chalk.blue(s), t)
    },
}

module.exports = { fetch, strFormat, objDelete, objFrom, log }
