class Summary {
  constructor() {
    this.regex = /<!--\s*more\s*-->/
  }

  getSummary(post) {
    const splited = post.split(this.regex)

    if (splited.length > 1) {
      return splited[0]
    }
    return ''
  }
}

module.exports = Summary
