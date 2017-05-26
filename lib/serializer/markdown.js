const os = require('os')
const hl = require('highlight.js')
const Marked = require('marked')

class Markdown extends Marked {
  constructor() {
    this.map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;',
    }
  }

  escape(html) {
    return html.replace(/[&<>"'`=/]/g, a => this.map[a])
  }
}

module.exports = Markdown
