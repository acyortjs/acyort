const path = require('path')

function getName(title) {
  return title.substr(1, title.indexOf(']') - 1)
}

function getTitle(title) {
  return title.split(']')[1]
}

class Page {
  constructor(markeder) {
    this.markeder = markeder
  }

  _(issue) {
    const { id, title, body } = issue
    const name = getName(title)

    return {
      id,
      url: path.join(name, '/'),
      path: path.join(name, 'index.html'),
      name,
      title: getTitle(title),
      created: issue.created_at,
      updated: issue.updated_at,
      content: this.markeder(body, true),
    }
  }
}

module.exports = Page
