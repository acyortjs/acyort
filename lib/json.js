const pathFn = require('path')
const fs = require('fs-extra')
const config = require('./config')()
const { log, convert } = require('./util')

function Json(data) {
    /*
    const posts = data.posts.map(post => post.id)
    const pages = data.pages.map(page => page.id)
    const paginations = {
        index: data.paginations.index.length,
        archives: data.paginations.archives.length,
        category: {},
        tag: {},
    }
    */

    const getPost = id => data.posts.find(post => post.id === id)

    const render = (path, content) => {
        const filePath = pathFn.join(process.cwd(), config.public_dir, path)
        fs.outputFileSync(filePath, JSON.stringify(content))
        log.done(path)
    }

    log.info('Generating JSON ...')

    // posts
    data.posts.forEach((p) => {
        const post = p
        const getRelated = (pid) => {
            if (!pid) {
                return ''
            }
            const { id, created, updated, title, summary, thumb } = getPost(pid)
            return { id, created, updated, title, summary, thumb }
        }

        delete post.raw
        delete post.summary
        delete post.path
        delete post.url

        post.prev = getRelated(post.prev)
        post.next = getRelated(post.next)

        post.categories = post.categories.map(c => ({ name: c.name, _name: convert(c.name) }))
        post.tags = post.tags.map(t => ({ name: t.name, _name: convert(t.name) }))

        render(`posts/${post.id}.json`, post)
    })

    /*
    // pages
    data.pages.forEach((page) => {
        render(`pages/${page.id}.json`, page)
    })

    // categories
    render('categories.json', data.categories)

    // tags
    render('tags.json', data.tags)

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

    // tag
    Object.keys(data.paginations.tags).forEach((t) => {
        data.paginations.tags[t].forEach((tag, i) => {
            render(`tag/${convert(tag.heading)}/${i}.json`, tag)
        })
    })

    // config
    render('config.json', config)
    */
}

module.exports = Json
