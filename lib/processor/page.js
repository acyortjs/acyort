const path = require('path')
const markeder = require('../markeder')

function postPage(issue) {
  const { id, title, updated_at, created_at, body } = issue
  const match = title.split(/^\[(.+?)]/)
  const name = match[1]

  return {
    id,
    url: path.join(name. '/'),
    path: path.join(name, 'index.html'),
    name,
    title: match[2],
    created: created_at,
    updated: updated_at,
    content: markeder(body),
  }
}

module.exports = postPage
