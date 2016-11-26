
const axios = require('axios')
const colors = require('colors')
const pinyin = require('pinyin')

axios.defaults.headers['User-Agent'] = 'AcyOrt'

const api = (user_repo) => `https://api.github.com/repos/${user_repo}/issues`

const fetch = (user_repo, data = {}) => {
    const url = api(user_repo) +'?'+ Object.keys(data).map(key => key +'='+ data[key]).join('&')

    return axios.get(url)
        .then(res => res)
        .catch(err => console.log('ERROR:'.red, err))
}

const textTransform = () => {
    String.prototype.transform = function() {
        return this
            .trim()
            .split('/')
            .map(s => pinyin(s, { style: pinyin.STYLE_NORMAL }).join('_'))
            .join('/')
            .toLowerCase()
            .replace(/\s/g, '_')
    }
}

const getThumb = (content) => content.match(/(!\[.*?\]\()(.+?)(\))/)

const getTags = (content) => content.match(/\<!-- tags:(.*?) --\>/)

module.exports = { fetch, textTransform, getThumb, getTags }
