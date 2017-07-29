const toc = require('markdown-toc')
const markeder = require('../markeder')

function postToc(body) {
  const { content } = toc(body)
  let html = markeder(content)
  const hrefs = html.match(/href="([^"]*")/g) || []
  const hrefsifies = hrefs.map(href => decodeURIComponent(href.replace(/_|-/g, '')))

  hrefs.forEach((href, i) => {
    html = html.replace(href, hrefsifies[i])
  })

  return html
}

module.exports = postToc
