const tocFn = require('markdown-toc')

function hrefsify(hrefs) {
  return hrefs.map(href => decodeURIComponent(href.replace(/_|-/g, '')))
}

function getHrefs(html) {
  return html.match(/href="([^"]*")/g) || []
}

class Toc {
  constructor(markeder) {
    this.markeder = markeder
  }

  _(body) {
    const { content } = tocFn(body)
    const html = this.markeder(content)
    const hrefs = getHrefs(html)
    const hrefsifies = hrefsify(hrefs)

    let tocHtml = html

    hrefs.forEach((href, i) => {
      tocHtml = tocHtml.replace(href, hrefsifies[i])
    })

    return tocHtml
  }
}

module.exports = Toc
