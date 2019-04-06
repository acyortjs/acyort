module.exports = class {
  constructor() {
    this.store = []
  }

  set(key, data) {
    const { context, namespace } = this
    const storeKey = `${namespace}:${key}`
    const index = context.store.findIndex(item => item.key === storeKey)

    if (index > -1) {
      context.store[index].data = data
    } else {
      context.store.push({ key: storeKey, data })
    }
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
