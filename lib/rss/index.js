const fs = require('fs-extra')
const Rss = require('rss')
const pathFn = require('path')

class RssFn extends Rss {
  constructor(acyort) {
    const { config } = acyort
    const {
      config: {
        title,
        description,
        url,
        rss,
        root,
      },
      logger,
    } = acyort

    super({
      title,
      description,
      feed_url: pathFn.join(url, root, rss),
      site_url: url,
      cdata: true,
      pubDate: new Date().toISOString(),
    })

    this.config = config
    this.logger = logger
  }

  _(posts) {
    const { root, url, rss, public_dir } = this.config

    if (!rss) {
      return false
    }

    posts.forEach((post) => {
      const {
        author: { name },
        title,
        updated,
        raw,
        path,
      } = post

      this.item({
        title,
        url: pathFn.join(url, root, path),
        author: name,
        date: updated,
        description: raw,
      })
    })

    fs.outputFileSync(pathFn.join(process.cwd(), public_dir, rss), this.xml())
    return this.logger.success(rss)
  }
}

module.exports = RssFn
