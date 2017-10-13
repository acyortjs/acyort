acyort.extend.register('after_process_data', data => {
  data.posts.forEach(post => post.title += '????')
  return data
})
