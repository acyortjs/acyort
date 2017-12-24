const path = require('path')

acyort.extend.register('after_build', (data) => {
  const { base, theme, public_dir } = acyort.config
  const output = path.join(base, public_dir, 'test.html')

  acyort.helper.posts = data.posts

  function getData(page) {
    return Object.assign({ page, config: acyort.config }, acyort.helper.methods)
  }

  function getRender(data) {
    acyort.renderer.compile([{
      tag: 'test',
      path: path.join(base, 'themes', theme, 'layout', 'categories.html')
    }])

    return acyort.renderer.render('swig', {
      tag: 'test',
      data
    })
  }

  const listener = ({ path, clients }) => {
    acyort.logger.info('path: ' + path)
    if (path.indexOf('categories') > -1) {
      acyort.fs.writeFileSync(output, getRender(getData(data.categories)))
      clients.forEach(client => client.send('html'))
    }
  }

  acyort.server.addListener(listener)
  acyort.server.start()
})

acyort.extend.helper('_js', function(s) {
  return s.split('').join('.')
})
