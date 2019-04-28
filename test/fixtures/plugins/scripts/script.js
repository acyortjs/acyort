module.exports = (acyort) => {
  if (acyort.workflow.start === undefined) {
    acyort.store.set('script')
  }
  throw new Error('Script Error')
}
