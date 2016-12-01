const _path = require('path')
const fs = require('fs-extra')
const colors = require('colors')
const moment = require('moment')
const feed = require('./feed')
const templates = require('./template')
const static = require('./static')
const config = require('./config')()

module.exports = function(data, liveReoad) {
    const render = (path, tpl, data) => {
        if (tpl) {
            const template = templates()
            fs.outputFileSync(_path.join(process.cwd(), config.public_dir, path), template[tpl](data))

            if (!liveReoad) {
                console.log(`\u221A ${path}`.green)    
            }
        }
    }

    const helper = {
        time(time, format) {
            return moment(time).format(format)
        },
        post(id) {
            return data.posts.find(post => post.id == id)
        },
        posts() {
            return data.posts.map(post => post.id)
        }
    }

    const mirror = { helper, config }
    
    if (!liveReoad) {
        static()
        feed(data.posts)
        console.log('Generating html ...'.blue)
    }
    
    // pages
    data.pages.forEach(page => {
        render(page.path, 'page', Object.assign({ page }, mirror))
    })

    // posts
    data.posts.forEach(post => {
        render(post.path, 'post', Object.assign({ post }, mirror))
    })
    // categories
    render('categories/index.html', 'categories', Object.assign({ categories: data.categories }, mirror))

    // tags
    render('tags/index.html', 'tags', Object.assign({ tags: data.tags }, mirror))

    // index
    data.paginations.index.forEach(index => {
        render(index.path, 'index', Object.assign({ index }, mirror))
    })

    // archives
    data.paginations.archives.forEach(archives => {
        render(archives.path, 'archives', Object.assign({ archives }, mirror))
    })

    // category
    for (var category in data.paginations.categories) {
        data.paginations.categories[category].forEach(category => {
            render(category.path, 'category', Object.assign({ category }, mirror))
        })
    }

    // tag
    for (var tag in data.paginations.tags) {
        data.paginations.tags[tag].forEach(tag => {
            render(tag.path, 'tag', Object.assign({ tag }, mirror))
        })
    }
}
