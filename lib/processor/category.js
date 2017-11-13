const path = require('path')

function postCatogory(issue, config) {
  const { category_dir, default_category } = config

  if (!issue.milestone) {
    return {
      id: 0,
      name: default_category,
      url: path.join(category_dir, '0/'),
    }
  }

  const { milestone: { id, title } } = issue

  return {
    id,
    name: title,
    url: path.join(category_dir, id.toString(), '/'),
  }
}

module.exports = postCatogory
