class Template {
  constructor() {
    this.templates = [
      'index',
      'categories',
      'category',
      'page',
      'post',
      'tag',
      'tags',
    ]
    this.ext = 'html'
  }

  set extension(ext) {
    this.ext = ext
  }

  register(templates) {
    for (let i = 0; i < templates.length; i += 1) {
      if (this.templates.indexOf(templates[i]) === -1) {
        this.templates.push(templates[i])
      }
    }
  }
}

module.exports = Template
