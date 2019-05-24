const getTemplate = require('./template')

module.exports = class {
  constructor(configs) {
    this.configs = configs
  }

  get(key) {
    if (!key) {
      return this.configs
    }
    return this.configs[key]
  }

  set(key, value) {
    this.configs[key] = value
    if (key === 'template') {
      this.configs.templatePath = getTemplate(this.configs)
    }
  }
}
