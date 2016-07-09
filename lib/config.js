
// config.yml -> config

var yaml = require('yamljs');

module.exports = function() {

    var config = yaml.load(process.cwd() +'/config.yml');

    config.public_dir = config.public_dir.replace(/\//g, '');

    if (config.url[config.url.length - 1] == '/') {
        config.url = config.url.substr(0, config.url.length - 1)
    }

    var root = config.url.replace('://', '');

    config.root = root.indexOf('/') > -1 ? root.substr(root.indexOf('/'), root.length) : '';

    for (var menu in config.menu) {
        config.menu[menu] = config.root + config.menu[menu]
    }

    config.category_dir = config.category_dir || 'category';
    config.tag_dir = config.tag_dir || 'tag';

    return config

}()
