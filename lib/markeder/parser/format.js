function format(heading) {
  const s = heading
  .toLowerCase()
  .split(' ')
  .join('')
  .split(/\t/)
  .join('')
  .split(/<\/?[^>]+>/)
  .join('')
  .replace(/&[^&;]+;/g, '')
  .split(/[|$&`~=\\@+*!?({[\]})<>=.,;:'"^]/)
  .join('')
  .split(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/)
  .join('')
  .replace(/-|_/g, '')

  return s
}

module.exports = format
