acyort.helper.register('_active', function (page, key) {
  let { type } = page

  if (
    (type === 'index' && key === 'home') ||
    (type === 'page' && key === 'about')
  ) {
    return 'active'
  }

  if (!type) {
    type = page[0].type
    if (
      (type === 'categories' && key === 'categories') ||
      (type === 'tags' && key === 'tags')
    ) {
      return 'active'
    }
  }

  return ''
})
