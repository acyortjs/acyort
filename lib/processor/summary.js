function postSummary(issue) {
  const regex = /<!--\s*more\s*-->/
  const splited = issue.split(regex)

  if (splited.length > 1) {
    return {
      summary: splited[0],
      main: issue.replace(regex, ''),
    }
  }

  return { summary: '', main: issue }
}

module.exports = postSummary
