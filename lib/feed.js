const config = require('./config')()
const fs = require('fs-extra')
const Rss = require('rss')
const path = require('path')
const { log } = require('./util')

function Feed(posts) {
    if (!config.rss) {
        return
    }

    const rssObj = path.parse(config.rss)

    const feed = new Rss({
        title: config.title,
        description: config.description || '',
        feed_url: path.join(config.url, config.rss),
        site_url: config.url,
        cdata: true,
        pubDate: new Date().toISOString(),
    })

    posts.forEach((post) => {
        feed.item({
            title: post.title,
            url: path.join(config.url, config.root, post.path),
            author: post.author.name,
            date: post.updated,
            description: post.raw,
        })
    })

    fs.outputFileSync(path.join(process.cwd(), config.public_dir, rssObj.base), feed.xml())

    log.done('Finished generating the RSS')
}

module.exports = Feed
