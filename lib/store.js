module.exports = class {
  constructor() {
    this.store = []
  }

  set(key, data) {
    const { context, namespace } = this
    context.store.push({ key: `${namespace}:${key}`, data })
  }

  get(key) {
    const { context, namespace } = this
    const record = context.store.find(item => item.key === `${namespace}:${key}`)
    return (record || {}).data
  }

  reset() {
    const { context, namespace } = this
    context.store = context.store.filter(({ key }) => !key.includes(namespace))
  }

  getExtData(name, key) {
    const { context } = this
    const pluginKey = `plugin:${name}:${key}`
    const scriptKey = `script:${name}:${key}`
    const record = context.store.find(({ key: k }) => k === pluginKey || k === scriptKey)
    return (record || {}).data
  }
}
