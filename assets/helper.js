const Helper = require('../lib/helper')

const config = {
  base: __dirname,
  theme: 'ccc45',
  language: 'en',
  i18n_dir: 'i18n',
  timezone: 'UTC',
  root: '/',
}

const helper = new Helper(config)
const { __, _n, _url, _time } = helper.methods

console.log(__('menu.home'))
console.log(__('paginator', 'a', 'b'))
console.log(_n('num', 0))
console.log(_n('num', 1))
console.log(_n('num', 190))

console.log(_url('ss'))
console.log(_url())

console.log(_time(Date.now(), 'YYYY.MM.DD'))

helper.setStore('posts', [{ id: 1 }, { id: 2 }])

helper.register('_test', function() {
  console.log(this.posts)
})

helper.methods._test()
