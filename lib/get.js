
// http get data

var yaml = require('yamljs'),
    https = require('https'),
    http = require('http');

var config = yaml.load('../config.yml');

module.exports = function(type, callback) {

    // dev mode
    config.dev_host = '127.0.0.1';
    config.dev_path = '/acyort';
    config.dev = true;

    var page = 1, data = [], get;

    function opt(page) {
        var host, path;

        if (config.dev) {
            host = config.dev_host;
            path = config.dev_path +'/test/'+ type + page +'.json'
        } else {
            host = 'api.github.com';
            path = '/repos/'+ config.issue_repo +'/'+ type +'?page='+ page +'&per_page=20'+ (config.token ? '&access_token='+ config.token.split(' ').join('') : '')
        }

        return {
            host: host,
            path: path,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }
    }

    ;(get = function() {
        console.log('Get '+ type +' ['+ page +']...')

        if (config.dev) {
            http.get(opt(page), function(res) {
                response(res)
            }).on('error', function(e) {
                console.log(e)
            })
        } else {
            https.get(opt(page), function(res) {
                response(res)
            }).on('error', function(e) {
                console.log(e)
            })
        }
    }).call()

    function response(res) {
        res.setEncoding('utf-8')

        if (res.statusCode != 200) {
            console.log('error'+ res.statusCode)
            process.exit()
        }

        var _data = '';

        res.on('data', function(chunk) {
            _data += chunk
        })

        res.on('end', function() {
            console.log('Get '+ type +' ['+ page +']...Done')

            _data = JSON.parse(_data);

            if (_data.length > 0) {
                data = data.concat(_data);

                page ++;
                setTimeout(function() { get() }, 1000)
            } else {
                callback(data)
            }
        })
    }

}
