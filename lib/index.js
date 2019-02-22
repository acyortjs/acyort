const { join } = require('path')
const acyort = require('./acyort')

module.exports = (config) => {
  const ctx = acyort(config)
  const { scripts, plugins, base } = config
  const { store } = ctx
  const { getPrototypeOf, getOwnPropertyNames } = Object
  const storeMethods = getOwnPropertyNames(getPrototypeOf(store))

  const exec = (path, type, name) => {
    const methods = {}

    storeMethods.forEach((m) => {
      if (m !== 'constructor') {
        methods[m] = store[m].bind({ context: store, namespace: `${type}:${name}` })
      }
    })

    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      require(path)({
        ...ctx,
        process: undefined,
        store: { ...store, ...methods },
      })
    } catch (e) {
      // ignore
    }
  }

  scripts.forEach(name => exec(join(base, 'scripts', name), 'script', name))
  plugins.forEach(name => exec(join(base, 'node_modules', name), 'plugin', name))

  return ctx
}
