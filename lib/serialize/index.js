const pathFn = require('path')
const categoryFn = require('./category')
const filterFn = require('./filter')
const tagFn = require('./tag')
const thumbFn = require('./thumb')
const markedFn = require('./marked')
const tocFn = require('./toc')
const paginationsFn = require('./paginations')

function Serialize(issues) {
    const config = global.config
    const categories = []
    const tags = []
    const paginations = { categories: {}, tags: {} }

    let posts = []
    let pages = []
    let temp

    // pages and posts
    temp = filterFn(issues, config)
    pages = temp.pages
    posts = temp.posts

    if (!pages.length && !posts.length) {
        return Promise.reject('No content')
    }

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
        console.log(temp)
        content = temp.content
        const thumb = temp.thumb

        // content
        if (content.indexOf(more) > -1) {
            summary = content.split(more)[0]
            content = content.replace(more, '')
        }

        const toc = tocFn(content)

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
            toc,
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
            const { id, name, url } = post.category
            categories.push({ id, name, url, posts: [post.id] })
        }

        // tags
        post.tags.forEach((tag) => {
            const i = tags.map(t => t.name).indexOf(tag.name)

            if (i > -1) {
                tags[i].posts.push(post.id)
            } else {
                const { id, name, url } = tag
                tags.push({ id, name, url, posts: [post.id] })
            }
        })
    })

    // paginations
    paginations.index = paginationsFn({ name: config.title, posts })
    paginations.archives = paginationsFn({ name: config.title, type: 'archives', posts })

    categories.forEach((c) => {
        const { id, name } = c
        paginations.categories[id] = paginationsFn({ type: 'category', id, posts: c.posts, name })
    })

    tags.forEach((t) => {
        const { id, name } = t
        paginations.tags[id] = paginationsFn({ type: 'tag', id, posts: t.posts, name })
    })

    return Promise.resolve({ pages, posts, categories, tags, paginations })
}

module.exports = Serialize
