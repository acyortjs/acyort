module.exports = function process() {
  const { scripts } = this.workflow

  return new Promise((resolve, reject) => {
    const exec = (script) => {
      if (scripts.length) {
        Promise.all([script()])
          .then(() => {
            scripts.splice(0, 1)
            exec(scripts[0])
          })
          .catch((err) => {
            this.logger.error(err)
            reject(err)
          })
      } else {
        resolve()
      }
    }
    exec(scripts[0])
  })
}
