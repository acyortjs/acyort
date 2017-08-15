const fs = require('fs-extra')
const Rss = require('rss')
const path = require('path')
const config = require('../config')
const Logger = require('../logger')

class RssFn extends Rss {
  constructor() {
    const {
      title,
      description,
      url,
      rss,
      root,
    } = config

    super({
      title,
      description,
      feed_url: path.join(url, root, rss),
      site_url: url,
      cdata: true,
      pubDate: new Date().toISOString(),
    })

    this.config = config
    this.logger = new Logger()
  }

  generate(posts) {
    const {
      root,
      url,
      rss,
      public_dir,
    } = this.config

    if (rss) {
      posts.forEach((post) => {
        const {
          author: { name },
          title,
          updated,
          raw,
        } = post

        this.item({
          title,
          url: path.join(url, root, post.path),
          author: name,
          date: updated,
          description: raw,
        })
      })

      fs.outputFileSync(path.join(process.cwd(), public_dir, rss), this.xml())
      this.logger.success(rss)
    }
  }
}

module.exports = RssFn
