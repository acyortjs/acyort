const pathFn = require('path')
const fs = require('fs-extra')
const config = require('./config')()
const { log, convert } = require('./util')

function Json(data) {
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
            return getPost(pid).from('id', 'created', 'updated', 'title', 'summary', 'thumb')
        }

        post.delete('raw', 'summary', 'path', 'url')
        post.prev = getRelated(post.prev)
        post.next = getRelated(post.next)
        post.category = { name: post.category.name, _name: convert(post.category.name) }
        post.tags = post.tags.map(t => ({ name: t.name, _name: convert(t.name) }))

        render(`posts/${post.id}.json`, post)
    })

    // pages
    data.pages.forEach((p) => {
        const page = p
        page.delete('path', 'url')
        render(`pages/${page.id}.json`, page)
    })

    /*
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

    */
}

module.exports = Json
