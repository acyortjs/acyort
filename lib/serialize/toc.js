const toc = require('markdown-toc')
const markedFn = require('./marked')

function Toc(content) {
    let tocHtml = markedFn(toc(content).content)
    const hrefs = tocHtml.match(/href="([^"]*")/g) || []
    const hrefsify = hrefs.map(href => decodeURIComponent(href.replace(/-_|_-/g, '-')))

    hrefs.forEach((href, i) => {
        tocHtml = tocHtml.replace(href, hrefsify[i])
    })

    return tocHtml
}

module.exports = Toc
