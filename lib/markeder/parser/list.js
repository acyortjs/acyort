function list(li) {
  if (/^\s*\[[x ]\]\s*/.test(li)) {
    const tasks = li
    .replace(/^\s*\[ \]\s*/, '<input type="checkbox" disabled /> ')
    .replace(/^\s*\[x\]\s*/, '<input type="checkbox" checked disabled /> ')

    return `<li style="list-style:none">${tasks}</li>`
  }

  return `<li>${li}</li>`
}

module.exports = list
