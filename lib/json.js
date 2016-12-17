const pathFn = require('path')
const fs = require('fs-extra')
const config = require('./config')()
const { log, objDelete, objFrom } = require('./util')

function Json(data) {
    const getPost = id => data.posts.find(post => post.id === id)

    const render = (path, content) => {
        const filePath = pathFn.join(process.cwd(), config.public_dir, path)
        fs.outputFileSync(filePath, JSON.stringify(content))
        log.done(path)
    }

    const simplePost = (id) => {
        if (!id) {
            return ''
        }
        return objDelete(getPost(id), 'raw', 'content', 'path', 'url', 'prev', 'next')
    }

    log.info('Generating JSON ...')

    // posts
    data.posts.forEach((p) => {
        const post = objDelete(p, 'raw', 'summary', 'path', 'url')

        post.prev = simplePost(post.prev)
        post.next = simplePost(post.next)
        post.category = objFrom(post.category, 'id', 'name')
        post.tags = post.tags.map(tag => objFrom(tag, 'id', 'name'))

        render(`posts/${post.id}.json`, post)
    })

    // pages
    data.pages.forEach((p) => {
        const page = objDelete(p, 'path', 'url')
        render(`pages/${page.id}.json`, page)
    })

    // tag
    Object.keys(data.paginations.tags).forEach((t) => {
        data.paginations.tags[t].forEach((tag, i) => {
            const { id, name } = tag
            const count = tag.posts.length
            const posts = tag.posts.map(post => simplePost(post))

            render(`tags/${id}/${i}.json`, { id, name, count, posts })
        })
    })

    // category
    Object.keys(data.paginations.categories).forEach((c) => {
        data.paginations.categories[c].forEach((category, i) => {
            const { id, name } = category
            const count = category.posts.length
            const posts = category.posts.map(post => simplePost(post))

            render(`categories/${id}/${i}.json`, { id, name, count, posts })
        })
    })

    // tags

    /*

    // index
    data.paginations.index.forEach((index, i) => {
        render(`index/${i}.json`, index)
    })

    // archives
    data.paginations.archives.forEach((archives, i) => {
        render(`archives/${i}.json`, archives)
    })

    // category
    Object.keys(data.paginations.categories).forEach((c) => {
        paginations.category[c] = data.paginations.categories[c].map(category => category.posts)
        data.paginations.categories[c].forEach((category, i) => {
            render(`category/${convert(category.heading)}/${i}.json`, category)
        })
    })
    */
}

module.exports = Json
