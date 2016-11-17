
const axios = require('axios')
const colors = require('colors')
const pinyin = require('pinyin')

axios.defaults.headers['User-Agent'] = 'AcyOrt'

const fetch = (url, data = {}) => {
    url = url +'?'+ Object.keys(data).map(key => key +'='+ data[key]).join('&')

    return axios.get(url)
        .then(res => res)
        .catch(err => console.log('ERROR:'.red, err))
}

const textTransform = () => {
    String.prototype.transform = () => {
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
