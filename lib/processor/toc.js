const tocFn = require('markdown-toc')

class Toc {
  constructor(acyort) {
    this.markeder = acyort.markeder
  }

  hrefsify(hrefs) {
    return hrefs.map(href => decodeURIComponent(href.replace(/_|-/g, '')))
  }

  getHrefs(html) {
    return html.match(/href="([^"]*")/g) || []
  }

  getToc(body) {
    const { content } = tocFn(body)
    const html = this.markeder(content)
    const hrefs = this.getHrefs(html)
    const hrefsify = this.hrefsify(hrefs)

    let tocHtml = html

    hrefs.forEach((href, i) => {
      tocHtml = tocHtml.replace(href, hrefsify[i])
    })

    return tocHtml
  }
}
