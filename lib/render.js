const pathFn = require('path')
const fs = require('fs-extra')
const moment = require('moment')
const feed = require('./feed')
const templates = require('./template')
const source = require('./source')
const config = require('./config')()
const { log } = require('./util')
const i18n = require('./i18n')

function Render(data, liveReoad) {
    const { language } = config
    const i18nFn = language.map(lan => i18n(lan))

    const render = (path, tpl, content) => {
        if (tpl) {
            const template = templates()
            let filePath = pathFn.join(process.cwd(), config.public_dir, path)

            language.forEach((lan, i) => {
                content.helper.__ = i18nFn[i].__
                content.helper.__n = i18nFn[i].__n

                if (i !== 0) {
                    filePath = pathFn.join(process.cwd(), config.public_dir, lan, path)
                }

                console.log(filePath)

                //fs.outputFileSync(filePath, template[tpl](content))

                if (!liveReoad) {
                    //log.done(path)
                }
            })
        }
    }

    const helper = {
        //__: i18n.__,
        //__n: i18n.__n,
        time(time, format) {
            return moment(time).format(format)
        },
        post(id) {
            return data.posts.find(post => post.id === id)
        },
        posts() {
            return data.posts.map(post => post.id)
        },
    }

    const mirror = { helper, config }

/*
    if (!liveReoad) {
        source()
        feed(data.posts)

        log.info('Generating html ...')
    }
    // pages
    data.pages.forEach((page) => {
        render(page.path, 'page', Object.assign({ page }, mirror))
    })

    // posts
    data.posts.forEach((post) => {
        render(post.path, 'post', Object.assign({ post }, mirror))
    })
    // categories
    render('categories/index.html', 'categories', Object.assign({ categories: data.categories }, mirror))

    // tags
    render('tags/index.html', 'tags', Object.assign({ tags: data.tags }, mirror))
*/
    // index
    data.paginations.index.forEach((index) => {
        render(index.path, 'index', Object.assign({ index }, mirror))
    })
/*
    // archives
    data.paginations.archives.forEach((archives) => {
        render(archives.path, 'archives', Object.assign({ archives }, mirror))
    })

    // category
    Object.keys(data.paginations.categories).forEach((c) => {
        data.paginations.categories[c].forEach((category) => {
            render(category.path, 'category', Object.assign({ category }, mirror))
        })
    })

    // tag
    Object.keys(data.paginations.tags).forEach((t) => {
        data.paginations.tags[t].forEach((tag) => {
            render(tag.path, 'tag', Object.assign({ tag }, mirror))
        })
    })
*/
}

module.exports = Render
