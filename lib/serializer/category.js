const pathFn = require('path')

class Category {
  constructor(config) {
    this.config = config
  }

  getCategory(issue) {
    if (!issue.milestone) {
      return {
        id: 0,
        name: this.config.default_category,
        url: pathFn.join(this.config.category_dir, '0/'),
      }
    }

    return {
      id: issue.milestone.id,
      name: issue.milestone.title,
      url: pathFn.join(this.config.category_dir, issue.milestone.id.toString(), '/'),
    }
  }
}

module.exports = Category
