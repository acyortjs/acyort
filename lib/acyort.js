
// get data from issues via github API

var config = require('./config');
var serialize = require('./serialize');
var build = require('./build');

var rp = require('request-promise');
var colors = require('colors');

var API = 'https://api.github.com/repos/'+ config.issue_repo +'/issues';

var _json;

module.exports = function(liveReoad) {

    if (config.dev) {
        var _issues;

        if (typeof(config.dev) == 'string') {
            _issues = require(process.cwd() +'/'+ config.dev) 
        } else {
            _issues = require('../test/issues.json') 
        }

        if (liveReoad && _json) {
            return build(_json, liveReoad)
        }

        return serialize(_issues, function(data) {
            // liveReoad
            if (liveReoad) {
                _json = data
            }

            build(data, liveReoad)
        })
    }

    var page = 1;
    var issues = [];
    var fetch;

    var options = function(page) {
        var req = {
            uri: API,
            headers: {
                'User-Agent': 'AcyOrt'
            },
            qs: {
                page: page,
                per_page: 20
            },
            json: true
        }

        if (config.token) {
            req.qs.access_token = config.token.split(' ').join('')
        }

        return req
    }

    console.log('INFO: '.blue +'fetching data from "'+ API +'" ...')

    ;(fetch = function() {

        var req = options(page)

        rp(req)
            .then(function(data) {

                if (!data.length) {
                    console.log('INFO: '.blue +'fetching data from "'+ API +'" ...done')

                    return serialize(issues, function(data) {
                        build(data)
                    })
                }

                issues = issues.concat(data);

                page ++;

                setTimeout(function() { fetch() }, 1000)

            })
            .catch(function(err) {
                console.log('x '.red + err.statusCode || err)
            })

    })()

}
