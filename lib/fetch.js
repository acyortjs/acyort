
// get data from issues via github API

var config = require('./config');
var rp = require('request-promise');
var colors = require('colors');

var API = 'https://api.github.com/repos/'+ config.issue_repo +'/issues';

module.exports = function(callback) {

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

    console.log('Info: '.blue +'fetching data from "'+ API +'" ...')

    ;(fetch = function() {

        var req = options(page)

        rp(req)
            .then(function(data) {

                if (!data.length) {
                    console.log('Info: '.blue +'fetching data from "'+ API +'" ...done')

                    return callback(issues)
                }

                issues = issues.concat(data);

                page ++;

                setTimeout(function() { fetch() }, 1000)

            })
            .catch(function(err) {
                console.log('Error: '.red + err.statusCode)
            })

    })()

}
