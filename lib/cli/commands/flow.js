module.exports = {
  name: 'flow',
  fullName: 'flow',
  description: 'Start AcyOrt workflow',
  action(args, acyort) {
    acyort.process()
  },
}
