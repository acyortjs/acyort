
// config.yml -> config

var yaml = require('yamljs');

module.exports = function() {

    var config = yaml.load(process.cwd() +'/config.yml');

    config.public_dir = config.public_dir.replace(/\//g, '');

    config.url = 'http://'+ config.url.replace('http://', '');

    if (config.url[config.url.length - 1] == '/') {
        config.url = config.url.substr(0, config.url.length - 1)
    }

    return config

}()
