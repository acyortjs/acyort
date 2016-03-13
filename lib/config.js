
// config.yml -> config

var yaml = require('yamljs');

module.exports = yaml.load(process.cwd() +'/config.yml')
