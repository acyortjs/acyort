
const path = require('path')
const config = require('../config')()
const { textTransform } = require('../util')

textTransform()

module.exports = function(post) {

    if (!post.labels.length) {
        return [{
            name: config.default_category,
            url: path.join(config.root, config.category_dir.transform(), config.default_category.transform(), '/')
        }]
    }

    return post.labels.map(label => { 
        name: label.name, 
        url: path.join(config.root, config.category_dir.transform(), label.name.transform(), '/')
    })

}

