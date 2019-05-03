module.exports = function helpCli() {
  const { commands, options } = this
  const width = 24

  let help = `
AcyOrt, A Node.js static website framework

Commands:`

  commands.forEach(({ fullName, description }) => {
    help += `
  ${fullName}${new Array(width - fullName.length).fill(' ').join('')}${description}`
  })

  help += `

Options:`

  options.forEach(({ name, alias, description }) => {
    help += `
  ${name}, ${alias}${new Array(width - 2 - name.length - alias.length).fill(' ').join('')}${description}`
  })

  help += `

For more information, check the docs: https://acyort.js.org
`
  return help
}
