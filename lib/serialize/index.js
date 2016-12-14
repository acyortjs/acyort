const pathFn = require('path')
const categoryFn = require('./category')
const filterFn = require('./filter')
const tagFn = require('./tag')
const thumbFn = require('./thumb')
const markedFn = require('./marked')
const paginationsFn = require('./paginations')
const config = require('../config')()
const { convert } = require('../util')

function Index(issues) {
    const categories = []
    const tags = []
    const paginations = { categories: {}, tags: {} }

    let posts = []
    let pages = []
    let temp

    // pages and posts
    temp = filterFn(issues)
    pages = temp.pages
    posts = temp.posts

    posts = posts.map((post, i) => {
        const id = post.id
        const created = post.created_at
        const updated = post.updated_at
        const title = post.title
        const path = `/${config.post_dir}/${id}.html`
        const url = pathFn.join(config.root, path)
        const prev = i > 0 ? posts[i - 1].id : ''
        const next = i < posts.length - 1 ? posts[i + 1].id : ''
        const author = {
            name: post.user.login,
            avatar: post.user.avatar_url,
            url: post.user.html_url,
        }
        const more = '<!-- more -->'

        let content = post.body
        let summary = ''

        // thumb
        temp = thumbFn(content)
        content = temp.content
        const thumb = temp.thumb

        // content
        if (content.indexOf(more) > -1) {
            summary = content.split(more)[0]
            content = content.replace(more, '')
        }

        temp = content
        summary = markedFn(summary)
        content = markedFn(temp)
        const raw = markedFn(temp, true)

        return {
            id,
            created,
            updated,
            prev,
            next,
            title,
            path,
            url,
            author,
            summary,
            raw,
            content,
            thumb,
            category: categoryFn(post),
            tags: tagFn(post),
        }
    })

    posts.forEach((post) => {
        // categories
        const index = categories.map(c => c.name).indexOf(post.category.name)

        if (index > -1) {
            categories[index].posts.push(post.id)
        } else {
            const { name, url } = post.category
            categories.push({ name, url, posts: [post.id] })
        }

        // tags
        post.tags.forEach((tag) => {
            const i = tags.map(t => t.name).indexOf(tag.name)

            if (i > -1) {
                tags[i].posts.push(post.id)
            } else {
                const { name, url } = tag
                tags.push({ name, url, posts: [post.id] })
            }
        })
    })

    // paginations
    const pid = posts.map(post => post.id)
    paginations.index = paginationsFn(pid, 'page')

    // archives require origin posts data
    paginations.archives = paginationsFn(posts, 'archives')

    categories.forEach((category) => {
        const categoryPath = pathFn.join(convert(config.category_dir), category.name)
        const categoryPage = paginationsFn(category.posts, categoryPath)

        paginations.categories[convert(category.name)] = categoryPage
    })

    tags.forEach((tag) => {
        const tagPath = pathFn.join(convert(config.tag_dir), tag.name)
        const tagPage = paginationsFn(tag.posts, tagPath)

        paginations.tags[convert(tag.name)] = tagPage
    })

    return Promise.resolve({ pages, posts, categories, tags, paginations })
}

module.exports = Index
