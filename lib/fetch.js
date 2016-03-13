
// fetch data from via github API

var config = require('./config.js');
var https = require('https');
var http = require('http');

module.exports = function(type, callback) {

    // local develop mode
    // set config.dev = true
    /* ------------------------------- */
    config.dev = true;
    config.dev_host = '127.0.0.1';
    config.dev_path = '/acyort/test/';
    /* ------------------------------- */

    var page = 1, data = [], fetch;

    function opt(page) {
        var host, path;

        if (config.dev) {
            host = config.dev_host;
            path = config.dev_path + type + page +'.json'
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

    ;(fetch = function() {
        console.log('fetch '+ type +' ['+ page +']...')

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
            console.log('fetch '+ type +' ['+ page +']...Done')

            _data = JSON.parse(_data);

            if (_data.length > 0) {
                data = data.concat(_data);

                page ++;
                setTimeout(function() { fetch() }, 1000)
            } else {
                callback(data)
            }
        })
    }

}
