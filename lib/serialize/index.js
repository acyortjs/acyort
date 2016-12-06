const _path = require('path')
const _category = require('./category')
const _filter = require('./filter')
const _tag = require('./tag')
const _thumb = require('./thumb')
const _marked = require('./marked')
const _paginations = require('./paginations')
const config = require('../config')()
const { convert } = require('../util')

module.exports = function index(issues) {

    let posts = []
    let pages = []
    let categories = []
    let tags = []
    let paginations = { categories: {}, tags: {} }
    let temp

    // pages and posts 
    temp = _filter(issues)
    pages = temp.pages
    posts = temp.posts

    posts = posts.map(post => {
        const id = post.id
        const created = post.created_at
        const updated = post.updated_at
        const categories = _category(post)
        const title = post.title
        const path = `/${config.post_dir}/${id}.html`
        const url = _path.join(config.root, path)
        const author = {
            name: post.user.login,
            avatar: post.user.avatar_url,
            url: post.user.html_url
        }
        const more = '<!-- more -->'

        let content = post.body
        let tags
        let thumb
        let raw
        let summary = ''

        // tags
        temp = _tag(content)
        content = temp.content
        tags = temp.tags

        // thumb
        temp = _thumb(content)
        content = temp.content
        thumb = temp.thumb

        // content
        if (content.indexOf(more) > -1) {
            summary = content.split(more)[0]
            content = content.replace(more, '')
        }
        summary = _marked(summary)
        raw = _marked(content, true)
        content = _marked(content)
        
        return { id, created, updated, categories, title, path, url, author, tags, thumb, summary, raw, content }
    })

    posts.forEach((post, i) => {
        // prev and next
        post.prev = i > 0 ? posts[i - 1].id : ''
        post.next = i < posts.length - 1 ? posts[i + 1].id : ''

        // categories
        post.categories.forEach(category => {
            const index = categories.map(category => category.name).indexOf(category.name)
            if (index > -1) {
                return categories[index].posts.push(post.id)
            }
            const { name, url } = category
            categories.push({name, url, posts: [post.id] })
        })

        // tags
        post.tags.forEach(tag => {
            const index = tags.map(tag => tag.name).indexOf(tag.name)
            if (index > -1) {
                return tags[index].posts.push(post.id)
            }
            const { name, url } = tag
            tags.push({name, url, posts: [post.id] })
        })
    })

    // paginations
    const pid = posts.map(post => post.id)
    paginations.index = _paginations(pid, 'page')

    // archives require origin posts data
    paginations.archives = _paginations(posts, 'archives')

    categories.forEach(category => {
        paginations.categories[convert(category.name)] = _paginations(category.posts, _path.join(convert(config.category_dir), category.name))
    })
    tags.forEach(tag => {
        paginations.tags[convert(tag.name)] = _paginations(tag.posts, _path.join(convert(config.tag_dir), tag.name))
    })

    return Promise.resolve({ pages, posts, categories, tags, paginations })
}
