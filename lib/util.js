const axios = require('axios')
const pinyin = require('pinyin')
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

const convert = (t) => {
    const text = t
        .trim()
        .toLowerCase()
        .split('/')
        .map(s => pinyin(s, { style: pinyin.STYLE_NORMAL })
        .join('_'))
        .join('/')
        .replace(/\s/g, '_')

    return text
}

const getThumb = content => content.match(/(!\[.*?]\()(.+?)(\))/)

const getTags = content => content.match(/<!-- tags:(.*?) -->/)

const log = {
    error(s) {
        clog(chalk.red('\u2716'), s)
    },
    done(s) {
        clog(chalk.green('\u2714'), s)
    },
    info(s) {
        clog(chalk.blue(s))
    },
}

module.exports = { fetch, convert, getThumb, getTags, log }
