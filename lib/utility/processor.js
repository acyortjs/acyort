module.exports = function process() {
  const { scripts } = this.workflow
  const exec = (script) => {
    if (scripts.length) {
      Promise.all([script()])
        .then(() => {
          scripts.splice(0, 1)
          exec(scripts[0])
        })
        .catch(err => this.logger.error(err))
    }
  }
  exec(scripts[0])
}
