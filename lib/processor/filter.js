const config = require('../config')

function issueFilter(issues) {
  const { authors } = config
  const posts = []
  const pages = []

  for (let i = 0; i < issues.length; i += 1) {
    const {
      title,
      user: { login },
    } = issues[i]

    if (!authors.length || authors.indexOf(login) > -1) {
      if (/^\[(.+?)]/.test(title)) {
        pages.push(issues[i])
      } else {
        posts.push(issues[i])
      }
    }
  }

  return { posts, pages }
}

module.exports = issueFilter
