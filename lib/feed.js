const config = require('./config')()
const fs = require('fs-extra')
const rss = require('rss')
const colors = require('colors')
const path = require('path')

module.exports = function(posts) {
    if (!config.rss) {
        return
    }

    const feed = new rss({
        title: config.title,
        description: config.description || '',
        feed_url: path.join(config.url, config.rss),
        site_url: config.url,
        cdata: true,
        pubDate: new Date().toISOString()
    })

    feed.item = posts.map(post => {
        return {
            title: post.title,
            url: path.join(config.url, post.path),
            author: post.author.name,
            date: post.updated,
            description: post.raw
        }
    })

    fs.outputFileSync(path.join(process.cwd(), config.public_dir, config.rss), feed.xml())

    console.log('\u221A Finished generating RSS'.green)    
}
