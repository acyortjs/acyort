const rss = require('rss')

acyort.extend.register('after_process_data', data => {
  console.log(rss)
  data.posts = data.posts.map(d => d.title)
  // return data
  return 0
})
