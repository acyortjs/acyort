module.exports = function process(catchError) {
  const scripts = this.workflow.scripts.slice(0)

  return new Promise((resolve, reject) => {
    const exec = (script) => {
      if (scripts.length) {
        Promise.resolve(script())
          .then(() => {
            scripts.splice(0, 1)
            exec(scripts[0])
          })
          .catch((e) => {
            if (catchError) {
              reject(e)
            } else {
              this.logger.error(e)
            }
          })
      } else {
        resolve()
      }
    }
    exec(scripts[0])
  })
}
