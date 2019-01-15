module.exports = class {
  constructor() {
    this.store = []
  }

  set(key, data) {
    const { context, namespace } = this
    context.store.push({ key: `${namespace}:${key}`, data })
  }

  get(key, name) {
    const { context, namespace } = this

    if (!name) {
      const record = context.store.find(item => item.key === `${namespace}:${key}`)
      return (record || {}).data
    }

    const pluginKey = `plugin:${name}:${key}`
    const scriptKey = `script:${name}:${key}`
    const record = context.store.find(({ key: k }) => k === pluginKey || k === scriptKey)

    return (record || {}).data
  }

  reset() {
    const { context, namespace } = this
    context.store = context.store.filter(({ key }) => !key.includes(namespace))
  }
}
