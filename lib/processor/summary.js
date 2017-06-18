class Summary {
  constructor() {
    this.regex = /<!--\s*more\s*-->/
  }

  _(post) {
    const splited = post.split(this.regex)

    if (splited.length > 1) {
      return {
        summary: splited[0],
        body: post.replace(this.regex, '')
      }
    }

    return {
      summary: '',
      body: post,
    }
  }
}

module.exports = Summary
