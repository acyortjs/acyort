const fs = require('fs-extra')
const Rss = require('rss')
const pathFn = require('path')
const { log } = require('./util')

function Feed(posts) {
  const config = global.config

  if (!config.rss) {
    return
  }

  const feed = new Rss({
    title: config.title,
    description: config.description,
    feed_url: pathFn.join(config.url, config.root, config.rss),
    site_url: config.url,
    cdata: true,
    pubDate: new Date().toISOString(),
  })

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      url: pathFn.join(config.url, config.root, post.path),
      author: post.author.name,
      date: post.updated,
      description: post.raw,
    })
  })

  fs.outputFileSync(pathFn.join(process.cwd(), config.public_dir, config.rss), feed.xml())

  log.done('Finished generating the RSS')
}

module.exports = Feed
