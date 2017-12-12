const yaml = require('yamljs')
const matters = []

acyort.extend.register('after_fetch', data => {
  // origin data from github API
  data.forEach((d, i) => {
    // get Hexo Front-matter
    const regex = /---([\s\S]*)(.*)([\s\S]*)---/
    const matched = d.body.match(regex)

    if (matched && matched.index === 0) {
      matters[i] = matched[1]
      d.body = d.body.replace(matched[0], '')
    } else {
      const body = d.body.split('---\r\n', 2)
      if (body.length > 1) {
        matters[i] = body[0]
        d.body = body[1]
      }
    }
  })
})

acyort.extend.register('after_process', data => {
  // json data after processed
  data.posts.forEach((d, i) => {
    // example: change the permalink
    if (matters[i]) {
      const matter = yaml.parse(matters[i])
      if (matter.permalink) {
        d.url = `${matter.permalink}`
        d.path = `${matter.permalink}/index.html`
      }
    }
  })
})
