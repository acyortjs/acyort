module.exports = class {
  constructor() {
    this.templates = []
    this.suffix = 'html'
  }

  set extension(suffix) {
    this.suffix = suffix
  }

  register(templates) {
    for (let i = 0; i < templates.length; i += 1) {
      if (this.templates.indexOf(templates[i]) === -1) {
        this.templates.push(templates[i])
      }
    }
  }
}
