const path = require('path')

class Page {
  constructor(acyort) {
    this.markeder = acyort.markeder
  }

  getName(title) {
    return title.substr(1, title.indexOf(']') - 1)
  }

  getTitle(title) {
    return title.split(']')[1]
  }

  getPage(issue) {
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
      content: this.markeder(body),
    }
  }
}
