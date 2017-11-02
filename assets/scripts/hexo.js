const yaml = require('yamljs')
const matters = []

acyort.extend.register('after_post_get', data => {
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

acyort.extend.register('after_post_process', data => {
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
