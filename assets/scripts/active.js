acyort.helper.register('_active', function (key) {
  let { type } = this

  if (
    (type === 'index' && key === 'home') ||
    (type === 'page' && key === 'about')
  ) {
    return 'active'
  }

  if (!type) {
    type = this[0].type
    if (
      (type === 'categories' && key === 'categories') ||
      (type === 'tags' && key === 'tags')
    ) {
      return 'active'
    }
  }

  return ''
})
