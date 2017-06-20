const pathFn = require('path')

class Tag {
  constructor(config) {
    this.config = config
  }

  _(issue) {
    if (!issue.labels.length) {
      return []
    }

    return issue.labels.map(label => ({
      id: label.id,
      name: label.name,
      url: pathFn.join(this.config.tag_dir, label.id.toString(), '/'),
    }))
  }
}

module.exports = Tag
