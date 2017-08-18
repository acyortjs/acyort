const path = require('path')
const config = require('../config')

function postTag(issue) {
  const { tag_dir } = config
  const { labels } = issue

  if (!labels.length) {
    return []
  }

  return labels.map((label) => {
    const { id, name } = label
    return {
      id,
      name,
      url: path.join(tag_dir, id.toString(), '/'),
    }
  })
}

module.exports = postTag
