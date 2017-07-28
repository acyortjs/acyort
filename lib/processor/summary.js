function postSummary(issue) {
  const regex = /<!--\s*more\s*-->/
  const splited = issue.split(regex)

  if (splited.length > 1) {
    return {
      summary: splited[0],
      content: issue.replace(regex, ''),
    }
  }

  return { summary: '', content: issue }
}

module.exports = postSummary
