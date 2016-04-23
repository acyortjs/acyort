
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

    config.menu.forEach(function(menu) {
        menu.url = config.root + menu.url
    })

    config.rss = config.root +'/'+ config.rss;

    return config

}()
