const axios = require('axios')
const pinyin = require('pinyin')
const chalk = require('chalk')
const clog = console.log

axios.defaults.headers['User-Agent'] = 'AcyOrt'

const api = (user, repo) => `https://api.github.com/repos/${user}/${repo}/issues`

const fetch = (user, repo, data = {}) => {
    const url = api(user, repo) +'?'+ Object.keys(data).map(key => key +'='+ data[key]).join('&')
    return axios.get(url).then(res => res)
}

const convert = (s) => {
    return s
            .trim()
            .toLowerCase()
            .split('/')
            .map(s => pinyin(s, { style: pinyin.STYLE_NORMAL }).join('_'))
            .join('/')
            .replace(/\s/g, '_')
}

const getThumb = (content) => content.match(/(!\[.*?\]\()(.+?)(\))/)

const getTags = (content) => content.match(/\<!-- tags:(.*?) --\>/)

const log = {
    error(s) {
        clog(chalk.red('\u2716'), s)
    },
    done(s) {
        clog(chalk.green('\u2714'), s)
    },
    info(s) {
        clog(chalk.blue(s))
    }
}

module.exports = { fetch, convert, getThumb, getTags, log }
