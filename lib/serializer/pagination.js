const pathFn = require('path')

class Pagination {
  constructor(config) {
    this.config = config
  }

  getPerpage(type) {
    return type === 'archives' ? this.config.archives_per_page : this.config.per_page
  }

  getRoute(type) {
    let route = 'page'

    if (type === 'tag') {
      route = `${this.config.tag_dir}/${id}`
    }
    if (type === 'category') {
      route = `${this.config.category_dir}/${id}`
    }
    if (type === 'archives') {
      route = this.config.archives_dir
    }

    return route
  }
}
